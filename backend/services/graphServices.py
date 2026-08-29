from pathlib import Path

from sqlalchemy.orm import Session, selectinload
from fastapi import HTTPException
from sqlalchemy import select
import json

from schemas.graphSchema import GraphCreate, GraphSchema
from models.graphModel import GraphModel
from models.nodeModel import NodeModel
from models.edgeModel import EdgeModel

TEST_JSON = Path(__file__).resolve().parent.parent / "test" / "test.json"


def create_graph(payload: GraphCreate, db: Session) -> GraphModel:
    graph = GraphModel(title=payload.title, subject=payload.subject)
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
        db.flush()
        slug_to_uuid[node.id] = row.id

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


def create_graph_from_json(db: Session) -> GraphSchema:
    data = read_json_file(TEST_JSON)
    payload = GraphCreate.model_validate(data)
    graph = create_graph(payload, db)
    loaded = db.scalar(
        select(GraphModel)
        .options(selectinload(GraphModel.nodes), selectinload(GraphModel.edges))
        .where(GraphModel.id == graph.id)
    )
    if loaded is None:
        raise HTTPException(status_code=500, detail="Failed to reload graph")
    return GraphSchema.model_validate(loaded)
