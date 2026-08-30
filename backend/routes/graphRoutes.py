from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from services.graphServices import create_graph_from_json, generate_graph
from schemas.graphSchema import GraphSchema, GraphSummary, GenerateGraphRequest
from services.deps import get_current_user_id
from models.userModel import User as UserModel
from typing import List
from services.graphServices import get_all_graphs
from services.graphServices import get_graph_by_id
from uuid import UUID
import uuid

router = APIRouter(prefix="/graph", tags=["graph"])


@router.post("/", response_model=GraphSchema)
async def seed_test_graph(db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        token.payload["sub"]
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return create_graph_from_json(db, current_user)

@router.get("/getall", response_model=List[GraphSummary])
async def get_graphs(db: Session = Depends(get_db), current_user_id: uuid.UUID = Depends(get_current_user_id)):
    return get_all_graphs(db, current_user_id)

@router.get("/get/{id}", response_model=GraphSchema)
async def get_graph(id: UUID, db: Session = Depends(get_db), current_user_id: uuid.UUID = Depends(get_current_user_id)):
    return get_graph_by_id(db, current_user_id, id)

@router.post("/generate")
async def generate_graph_endpoint(body: GenerateGraphRequest, db: Session = Depends(get_db),current_user_id: uuid.UUID = Depends(get_current_user_id))->GraphSchema:
    graph = generate_graph(db, current_user_id, body.notes)
    return graph