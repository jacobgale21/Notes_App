from schemas.nodeSchema import NodeCreateInput, NodeSchema
from models.nodeModel import NodeModel
from models.graphModel import GraphModel
from sqlalchemy.orm import Session
from uuid import UUID
import uuid
from fastapi import HTTPException

def create_node_endpoint(db: Session, current_user_id: uuid.UUID, graph_id: UUID, node: NodeCreateInput) -> NodeModel:
    graph = db.get(GraphModel, graph_id)
    if graph is None or graph.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Graph not found or you are not the owner of the graph")
    node_model = NodeModel(
        graph_id=graph_id,
        title=node.title,
        subtitle=node.subtitle,
        description=node.description,
        type_=node.type,
        content=[block.model_dump() for block in node.content],
        category=node.category,
    )
    db.add(node_model)
    db.commit()
    db.refresh(node_model)
    return NodeSchema.model_validate(node_model)