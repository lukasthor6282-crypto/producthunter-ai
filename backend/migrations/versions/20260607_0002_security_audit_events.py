"""Add security audit events.

Revision ID: 20260607_0002
Revises: 20260607_0001
Create Date: 2026-06-07 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260607_0002"
down_revision = "20260607_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "security_audit_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("event_type", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("ip_address", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("details", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_security_audit_events_created_at", "security_audit_events", ["created_at"], unique=False)
    op.create_index("ix_security_audit_events_email", "security_audit_events", ["email"], unique=False)
    op.create_index("ix_security_audit_events_event_type", "security_audit_events", ["event_type"], unique=False)
    op.create_index("ix_security_audit_events_id", "security_audit_events", ["id"], unique=False)
    op.create_index("ix_security_audit_events_ip_address", "security_audit_events", ["ip_address"], unique=False)
    op.create_index("ix_security_audit_events_status", "security_audit_events", ["status"], unique=False)
    op.create_index("ix_security_audit_events_type_created", "security_audit_events", ["event_type", "created_at"], unique=False)
    op.create_index("ix_security_audit_events_user_created", "security_audit_events", ["user_id", "created_at"], unique=False)
    op.create_index("ix_security_audit_events_user_id", "security_audit_events", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_security_audit_events_user_id", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_user_created", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_type_created", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_status", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_ip_address", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_id", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_event_type", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_email", table_name="security_audit_events")
    op.drop_index("ix_security_audit_events_created_at", table_name="security_audit_events")
    op.drop_table("security_audit_events")
