"""Add admin flag to users.

Revision ID: 20260615_0005
Revises: 20260614_0004
Create Date: 2026-06-15 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260615_0005"
down_revision: str | None = "20260614_0004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("is_admin", sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.create_index("ix_users_is_admin", "users", ["is_admin"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_users_is_admin", table_name="users")
    op.drop_column("users", "is_admin")
