from pathlib import Path
from typing import List
from sqlalchemy.orm import Session, selectinload
from fastapi import HTTPException, Response, status
from sqlalchemy import select, desc
import json
from models.userModel import User as UserModel
from schemas.graphSchema import GraphCreate, GraphSchema, GraphSummary
from models.graphModel import GraphModel
from models.nodeModel import NodeModel
from models.edgeModel import EdgeModel
from uuid import UUID
import uuid
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
load_dotenv()


TEST_JSON = Path(__file__).resolve().parent.parent / "test" / "test.json"


def store_graph(payload: GraphCreate, db: Session, current_user_id: uuid.UUID) -> GraphModel:
    nodes: list[tuple[str, NodeModel]] = []
    graph = GraphModel(title=payload.title, subject=payload.subject, user_id=current_user_id)
    db.add(graph)
    db.flush()

    slug_to_uuid: dict[str, object] = {}
    for node in payload.nodes:
        if node.id in slug_to_uuid:
            raise HTTPException(status_code=400, detail=f"Duplicate node id {node.id}")
        row = NodeModel(
            graph_id=graph.id,
            title=node.title,
            subtitle=node.subtitle,
            description=node.description,
            type_=node.type,
            category=node.category,
            content=[block.model_dump() for block in node.content],
        )
        db.add(row)
        nodes.append((node.id, row))
    db.flush()

    slug_to_uuid = { slug: row.id for slug, row in nodes }

    for edge in payload.edges:
        try:
            source_id = slug_to_uuid[edge.source]
            target_id = slug_to_uuid[edge.target]
        except KeyError as e:
            raise HTTPException(
                status_code=400, detail=f"Edge points at unknown node {e}"
            ) from e
        db.add(
            EdgeModel(
                graph_id=graph.id,
                source_id=source_id,
                target_id=target_id,
                rel_type=edge.rel_type,
            )
        )

    db.commit()
    return graph


def read_json_file(file_path: Path) -> dict:
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def create_graph_from_json(db: Session, current_user_id: uuid.UUID) -> GraphSchema:
    data = read_json_file(TEST_JSON)
    payload = GraphCreate.model_validate(data)
    graph = store_graph(payload, db, current_user_id)
    loaded = db.scalar(
        select(GraphModel)
        .options(selectinload(GraphModel.nodes), selectinload(GraphModel.edges))
        .where(GraphModel.id == graph.id)
    )
    if loaded is None:
        raise HTTPException(status_code=500, detail="Failed to reload graph")
    return GraphSchema.model_validate(loaded)



def get_all_graphs(db: Session, current_user_id: uuid.UUID) -> list[GraphSummary]:
    rows = db.execute(
        select(
            GraphModel.id,
            GraphModel.title,
            GraphModel.subject,
            GraphModel.updated_at,
        ).where(GraphModel.user_id == current_user_id).order_by(desc(GraphModel.updated_at))
    ).all()
    return [
        GraphSummary(
            id=row.id,
            title=row.title,
            subject=row.subject,
            updated_at=row.updated_at,
        )
        for row in rows
    ]

def get_graph_by_id(db: Session, current_user_id: uuid.UUID, id: UUID) -> GraphSchema:
    row = db.scalar(
        select(GraphModel)
        .options(selectinload(GraphModel.nodes), selectinload(GraphModel.edges))
        .where(GraphModel.id == id, GraphModel.user_id == current_user_id)
    )
    if row is None:
        raise HTTPException(status_code=404, detail="Graph not found")
    return GraphSchema.model_validate(row)


# Use LLM to generate Graph from Notes
def create_graph(notes: str) -> GraphCreate:
    # Code here
    system_prompt = """
You convert a student's lecture notes into only oneknowledge graph for studying.

Return a one, single JSON object that matches this shape (no markdown, no commentary):

{
  "title": string,
  "subject": string,
  "nodes": [Node],
  "edges": [Edge]
}

Node:
{
  "id": string,              // unique slug, e.g. "cpu", "instruction-cycle"
  "title": string,           // short display name
  "subtitle": string | null, // optional expansion of the title
  "description": string,     // one sentence: what this idea is
  "type": "root" | "topic" | "concept",
  "category": string | null, // optional grouping label, e.g. "Hardware"
  "content": [ContentBlock]
}

ContentBlock:
{
  "id": string,              // "{node-id}-1", "{node-id}-2", ...
  "type": "text" | "definition" | "equation",
  "text": string             // one study-ready fact, not a paragraph
}

Edge:
{
  "source": string,          // a node id
  "target": string,          // a node id
  "rel_type": "contains" | "related" | "depends_on"
}

STRUCTURE
- Exactly one node with type "root". Its title should match the graph title (the overall subject of the notes).
- Topics are major sections or headings. Concepts are specific terms, mechanisms, or facts under a topic.
- Prefer a shallow tree: root → topics → concepts. Depth of 2-3 is enough.
- Aim for about 8-25 nodes unless the notes are very short or very long.
- Every non-root node must be reachable from the root by following "contains" edges.

EDGES
- "contains": parent has child as a part/subtopic (root contains topics, topics contain concepts). Direction is parent → child.
- "related": two nodes are associated but neither contains the other. Use sparingly.
- "depends_on": target is needed to understand source (source depends on target). Example: "instruction-cycle" depends_on "cpi" only if the notes actually say that.
- Do not create cycles in "contains".
- Every edge source and target must be an existing node id.
- No duplicate edges (same source, target, and rel_type).
- No self-edges.

IDS
- Node ids: lowercase kebab-case slugs from the title ("Central Processing Unit" → "cpu" or "central-processing-unit"). Unique across the graph.
- Never use UUIDs. Never reuse an id.
- Content block ids: "{node-id}-1", "{node-id}-2", …

CONTENT QUALITY
- Pull only from the notes. Do not invent facts, examples, or topics that are not present or clearly implied.
- Ignore page numbers, "week 3", homework reminders, and other logistics unless they are the subject.
- description: one clear sentence.
- content: 2-5 bullets per node. Each bullet is one idea, ~8-20 words.
  - "text": normal key points
  - "definition": formal "X is …" wording when the notes define a term
  - "equation": formulas, identities, or symbolic relations, kept as the notes wrote them
- title/subject: infer a concise course-style title and a broad subject (e.g. "Computer Science").

If the notes are messy, still produce a single, valid graph: group related fragments under topics, drop pure noise, and keep edges conservative.
"""
    client = genai.Client(api_key=os.getenv("LLM_KEY"))
    chat = client.chats.create(
        model="gemini-3.6-flash",
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GraphCreate
        )
    )

    # Send your message through the chat session instead
    response = chat.send_message([system_prompt, notes])
    payload = GraphCreate.model_validate_json(response.text)
    return payload

def generate_graph(db: Session, current_user_id: uuid.UUID, notes: str) -> GraphSchema:
    try:
        if notes is None or notes == "":
            print("Notes are required")
            raise HTTPException(status_code=400, detail="Notes are required")
        elif len(notes) > 20000:
            print("Notes are too long")
            raise HTTPException(status_code=400, detail="Notes are too long")
        else:
            # Generate Graph from Notes with LLM
            payload = create_graph(notes)
            graph = store_graph(payload, db, current_user_id)
            return GraphSchema.model_validate(graph)

    except Exception as error:
        print(f"Failed to generate graph: {error}")
        raise HTTPException(status_code=500, detail=f"Failed to generate graph: {error}") from error
        

