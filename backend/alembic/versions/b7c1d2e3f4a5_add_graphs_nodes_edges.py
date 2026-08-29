"""Add graphs, nodes, and edges tables

Revision ID: b7c1d2e3f4a5
Revises: a0497d8a56ce
Create Date: 2026-08-28 20:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "b7c1d2e3f4a5"
down_revision: Union[str, Sequence[str], None] = "a0497d8a56ce"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "graphs",
        sa.Column("id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "nodes",
        sa.Column("id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("graph_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("subtitle", sa.String(length=255), nullable=True),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("type", sa.String(length=32), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=True),
        sa.Column("content", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.ForeignKeyConstraint(["graph_id"], ["graphs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("graph_id", "id", name="uq_nodes_graph_id_id"),
    )
    op.create_index(op.f("ix_nodes_graph_id"), "nodes", ["graph_id"], unique=False)
    op.create_table(
        "edges",
        sa.Column("id", sa.Uuid(), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("graph_id", sa.Uuid(), nullable=False),
        sa.Column("source_id", sa.Uuid(), nullable=False),
        sa.Column("target_id", sa.Uuid(), nullable=False),
        sa.Column("rel_type", sa.String(length=32), nullable=False),
        sa.ForeignKeyConstraint(["graph_id"], ["graphs.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["graph_id", "source_id"],
            ["nodes.graph_id", "nodes.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["graph_id", "target_id"],
            ["nodes.graph_id", "nodes.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "graph_id",
            "source_id",
            "target_id",
            "rel_type",
            name="uq_edges_graph_source_target_rel",
        ),
    )
    op.create_index(op.f("ix_edges_graph_id"), "edges", ["graph_id"], unique=False)
    op.create_index(op.f("ix_edges_source_id"), "edges", ["source_id"], unique=False)
    op.create_index(op.f("ix_edges_target_id"), "edges", ["target_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_edges_target_id"), table_name="edges")
    op.drop_index(op.f("ix_edges_source_id"), table_name="edges")
    op.drop_index(op.f("ix_edges_graph_id"), table_name="edges")
    op.drop_table("edges")
    op.drop_index(op.f("ix_nodes_graph_id"), table_name="nodes")
    op.drop_table("nodes")
    op.drop_table("graphs")
