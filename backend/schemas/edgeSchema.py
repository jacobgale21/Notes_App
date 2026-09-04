from typing import Literal
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
RelType = Literal["contains", "related", "depends_on"]

class EdgeSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, serialize_by_alias=True)
    id: UUID
    source: UUID = Field(validation_alias="source_id", serialization_alias="source")
    target: UUID = Field(validation_alias="target_id", serialization_alias="target")
    rel_type: RelType
    graph_id: UUID
    
class EdgeCreate(BaseModel):
    source: str  
    target: str
    rel_type: RelType

class EdgePatchInput(BaseModel):
    rel_type: RelType | None = None
    source_id: UUID | None = None
    target_id: UUID | None = None