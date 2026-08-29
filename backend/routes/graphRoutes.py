from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from services.graphServices import create_graph_from_json
from schemas.graphSchema import GraphSchema

router = APIRouter(prefix="/graph", tags=["graph"])


@router.post("/", response_model=GraphSchema)
async def seed_test_graph(db: Session = Depends(get_db)):
    return create_graph_from_json(db)
