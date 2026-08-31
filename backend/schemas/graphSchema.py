from pydantic import BaseModel, ConfigDict
from .nodeSchema import NodeSchema, NodeCreate
from .edgeSchema import EdgeSchema, EdgeCreate
from datetime import datetime
from uuid import UUID
from fastapi import UploadFile


class GraphCreate(BaseModel):
    title: str
    subject: str
    nodes: list[NodeCreate]
    edges: list[EdgeCreate]

class GraphSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, serialize_by_alias=True)
    id: UUID
    user_id: UUID
    title: str
    subject: str
    updated_at: datetime
    nodes: list[NodeSchema]
    edges: list[EdgeSchema]

class GraphSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    subject: str
    updated_at: datetime

class GenerateGraphRequest(BaseModel):
    notes: str
    pdf_file: UploadFile