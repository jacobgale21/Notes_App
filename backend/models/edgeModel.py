from sqlalchemy import ForeignKey, ForeignKeyConstraint, String, UniqueConstraint, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base
import uuid


class EdgeModel(Base):
    __tablename__ = "edges"
    __table_args__ = (
        UniqueConstraint(
            "graph_id",
            "source_id",
            "target_id",
            "rel_type",
            name="uq_edges_graph_source_target_rel",
        ),
        ForeignKeyConstraint(
            ["graph_id", "source_id"],
            ["nodes.graph_id", "nodes.id"],
            ondelete="CASCADE",
        ),
        ForeignKeyConstraint(
            ["graph_id", "target_id"],
            ["nodes.graph_id", "nodes.id"],
            ondelete="CASCADE",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    graph_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("graphs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False, index=True)
    target_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False, index=True)
    rel_type: Mapped[str] = mapped_column(String(32), nullable=False)

    graph: Mapped["GraphModel"] = relationship(back_populates="edges")
