from typing import Literal
from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
rel_type = Literal["contains", "related", "depends_on"]

class EdgeSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, serialize_by_alias=True)
    id: UUID
    source: UUID = Field(validation_alias="source_id", serialization_alias="source")
    target: UUID = Field(validation_alias="target_id", serialization_alias="target")
    rel_type: rel_type
    
class EdgeCreate(BaseModel):
    source: str  
    target: str
    rel_type: rel_type
