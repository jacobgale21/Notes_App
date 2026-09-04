from fastapi import HTTPException
from models.graphModel import GraphModel
from sqlalchemy.orm import Session
from uuid import UUID
import uuid
from schemas.edgeSchema import EdgeCreate, EdgeSchema, EdgePatchInput
from models.graphModel import GraphModel
from models.nodeModel import NodeModel
from models.edgeModel import EdgeModel

def create_edge_endpoint(db: Session, current_user_id: uuid.UUID, graph_id: UUID, edge: EdgeCreate)->EdgeSchema:
    graph = db.get(GraphModel, graph_id)
    if graph is None or graph.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Graph not found or you are not the owner of the graph")

    source = db.get(NodeModel, UUID(edge.source))
    target = db.get(NodeModel, UUID(edge.target))
    if (
        source is None or target is None
        or source.graph_id != graph_id
        or target.graph_id != graph_id
    ):
        raise HTTPException(status_code=400, detail="Source or target not in this graph")
    if source.id == target.id:
        raise HTTPException(status_code=400, detail="Cannot connect a node to itself")

    new_edge = EdgeModel(
        graph_id=graph_id,
        source_id=source.id,
        target_id=target.id,
        rel_type=edge.rel_type,
    )
    db.add(new_edge)
    db.commit()
    db.refresh(new_edge)
    return EdgeSchema.model_validate(new_edge)

def delete_edge_endpoint(db: Session, current_user_id: uuid.UUID, graph_id: UUID, edge_id: UUID)->None:
    graph = db.get(GraphModel, graph_id)
    if graph is None or graph.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Graph not found or you are not the owner of the graph")
    edge = db.get(EdgeModel, edge_id)
    if edge is None or edge.graph_id != graph_id:
        raise HTTPException(status_code=404, detail="Edge not found or you are not the owner of the graph")
    db.delete(edge)
    db.commit()
    return None

def patch_edge_endpoint(db: Session, current_user_id: uuid.UUID, graph_id: UUID, edge_id: UUID, edge: EdgePatchInput)->EdgeSchema:
    graph = db.get(GraphModel, graph_id)
    edge_model = db.get(EdgeModel, edge_id)
    if (
    graph is None
    or graph.user_id != current_user_id
    or edge_model is None
    or edge_model.graph_id != graph_id
    ):
        raise HTTPException(status_code=404, detail="Graph or edge not found or you are not the owner of the graph")
   
    data = edge.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(edge_model, key, value)
    db.commit()
    db.refresh(edge_model)
    return EdgeSchema.model_validate(edge_model)
