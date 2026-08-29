from sqlalchemy import ForeignKey, String, UniqueConstraint, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base
import uuid


class NodeModel(Base):
    __tablename__ = "nodes"
    __table_args__ = (
        UniqueConstraint("graph_id", "id", name="uq_nodes_graph_id_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    graph_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("graphs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(String, nullable=False)
    type_: Mapped[str] = mapped_column("type", String(32), nullable=False)
    category: Mapped[str | None] = mapped_column(String(64), nullable=True)
    content: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)

    graph: Mapped["GraphModel"] = relationship(back_populates="nodes")
