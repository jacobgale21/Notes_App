from pydantic import BaseModel, ConfigDict, Field
from typing import Literal
from uuid import UUID

NodeKind = Literal["root", "topic", "concept"]
ContentBlockType = Literal["text", "definition", "equation"]

class ContentBlock(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    type: ContentBlockType
    text: str

class NodeSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, serialize_by_alias=True)
    id: UUID
    title: str
    subtitle: str | None = None
    description: str
    type: NodeKind = Field(validation_alias="type_", serialization_alias="type")
    content: list[ContentBlock]
    category: str | None = None


class NodeCreateInput(BaseModel):
    title: str
    subtitle: str | None = None
    description: str
    type: NodeKind
    content: list[ContentBlock]
    category: str | None = None
