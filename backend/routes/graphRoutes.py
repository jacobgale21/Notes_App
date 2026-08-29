from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from services.graphServices import create_graph_from_json
from schemas.graphSchema import GraphSchema, GraphSummary
from services.deps import get_current_user
from models.userModel import User as UserModel
from typing import List
from services.graphServices import get_all_graphs
from services.graphServices import get_graph_by_id
from uuid import UUID
router = APIRouter(prefix="/graph", tags=["graph"])


@router.post("/", response_model=GraphSchema)
async def seed_test_graph(db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return create_graph_from_json(db, current_user)

@router.get("/getall", response_model=List[GraphSummary])
async def get_graphs(db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return get_all_graphs(db, current_user)

@router.get("/get/{id}", response_model=GraphSchema)
async def get_graph(id: UUID, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return get_graph_by_id(db, current_user, id)