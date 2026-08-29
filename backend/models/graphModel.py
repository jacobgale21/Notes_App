from sqlalchemy import Column, Integer, String, ForeignKey, Uuid, func
from db import Base
import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from typing import List
from sqlalchemy.types import DateTime
from sqlalchemy.orm import relationship

class GraphModel(Base):
    __tablename__ = "graphs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    subject: Mapped[str] = mapped_column(String, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )

    # Relationships
    nodes: Mapped[List["NodeModel"]] = relationship(
        back_populates="graph", 
        cascade="all, delete-orphan"
    )
    edges: Mapped[List["EdgeModel"]] = relationship(
        back_populates="graph", 
        cascade="all, delete-orphan"
    )
