"""Add recommendation insight indexes.

Revision ID: 20260610_0003
Revises: 20260607_0002
Create Date: 2026-06-10 00:00:00.000000
"""

from collections.abc import Sequence

from alembic import op


revision: str = "20260610_0003"
down_revision: str | None = "20260607_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_index(
        "ix_recommendation_run_items_product_score",
        "recommendation_run_items",
        ["product_id", "opportunity_score"],
        unique=False,
    )
    op.create_index(
        "ix_recommendation_run_items_marketplace_score",
        "recommendation_run_items",
        ["marketplace", "opportunity_score"],
        unique=False,
    )
    op.create_index(
        "ix_recommendation_run_items_niche_score",
        "recommendation_run_items",
        ["niche", "opportunity_score"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_recommendation_run_items_niche_score", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_marketplace_score", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_product_score", table_name="recommendation_run_items")
