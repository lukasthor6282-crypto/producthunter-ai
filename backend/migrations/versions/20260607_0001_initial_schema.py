"""Initial ProductHunter schema.

Revision ID: 20260607_0001
Revises:
Create Date: 2026-06-07 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260607_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("google_sub", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("picture_url", sa.String(length=1024), nullable=True),
        sa.Column("locale", sa.String(length=32), nullable=True),
        sa.Column("email_verified", sa.Boolean(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_google_sub", "users", ["google_sub"], unique=True)
    op.create_index("ix_users_id", "users", ["id"], unique=False)

    op.create_table(
        "user_sessions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("ip_address", sa.String(length=64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_sessions_active_lookup", "user_sessions", ["token_hash", "expires_at", "revoked_at"], unique=False)
    op.create_index("ix_user_sessions_expires_at", "user_sessions", ["expires_at"], unique=False)
    op.create_index("ix_user_sessions_id", "user_sessions", ["id"], unique=False)
    op.create_index("ix_user_sessions_token_hash", "user_sessions", ["token_hash"], unique=True)
    op.create_index("ix_user_sessions_user_id", "user_sessions", ["user_id"], unique=False)

    op.create_table(
        "billing_subscriptions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("plan_slug", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("stripe_customer_id", sa.String(length=255), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(length=255), nullable=True),
        sa.Column("stripe_price_id", sa.String(length=255), nullable=True),
        sa.Column("current_period_start", sa.DateTime(timezone=True), nullable=True),
        sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cancel_at_period_end", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_billing_subscriptions_id", "billing_subscriptions", ["id"], unique=False)
    op.create_index("ix_billing_subscriptions_status", "billing_subscriptions", ["status"], unique=False)
    op.create_index("ix_billing_subscriptions_stripe_customer_id", "billing_subscriptions", ["stripe_customer_id"], unique=True)
    op.create_index("ix_billing_subscriptions_stripe_price_id", "billing_subscriptions", ["stripe_price_id"], unique=False)
    op.create_index("ix_billing_subscriptions_stripe_subscription_id", "billing_subscriptions", ["stripe_subscription_id"], unique=True)
    op.create_index("ix_billing_subscriptions_user_id", "billing_subscriptions", ["user_id"], unique=True)

    op.create_table(
        "recommendation_runs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("operation_type", sa.String(length=48), nullable=False),
        sa.Column("marketplace", sa.String(length=48), nullable=False),
        sa.Column("niche", sa.String(length=48), nullable=False),
        sa.Column("goal", sa.String(length=64), nullable=False),
        sa.Column("investment_range", sa.String(length=48), nullable=False),
        sa.Column("experience_level", sa.String(length=48), nullable=False),
        sa.Column("traffic_type", sa.String(length=48), nullable=False),
        sa.Column("requested_limit", sa.Integer(), nullable=False),
        sa.Column("total_candidates", sa.Integer(), nullable=False),
        sa.Column("returned_count", sa.Integer(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("applied_filters", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_recommendation_runs_created_at", "recommendation_runs", ["created_at"], unique=False)
    op.create_index("ix_recommendation_runs_goal", "recommendation_runs", ["goal"], unique=False)
    op.create_index("ix_recommendation_runs_id", "recommendation_runs", ["id"], unique=False)
    op.create_index("ix_recommendation_runs_investment_range", "recommendation_runs", ["investment_range"], unique=False)
    op.create_index("ix_recommendation_runs_marketplace", "recommendation_runs", ["marketplace"], unique=False)
    op.create_index("ix_recommendation_runs_niche", "recommendation_runs", ["niche"], unique=False)
    op.create_index("ix_recommendation_runs_operation_type", "recommendation_runs", ["operation_type"], unique=False)
    op.create_index("ix_recommendation_runs_profile", "recommendation_runs", ["operation_type", "marketplace", "niche", "investment_range"], unique=False)
    op.create_index("ix_recommendation_runs_user_created", "recommendation_runs", ["user_id", "created_at"], unique=False)
    op.create_index("ix_recommendation_runs_user_id", "recommendation_runs", ["user_id"], unique=False)

    op.create_table(
        "recommendation_run_items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("run_id", sa.Integer(), nullable=False),
        sa.Column("rank", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=False),
        sa.Column("product_name", sa.String(length=255), nullable=False),
        sa.Column("marketplace", sa.String(length=48), nullable=False),
        sa.Column("marketplace_label", sa.String(length=80), nullable=False),
        sa.Column("niche", sa.String(length=48), nullable=False),
        sa.Column("niche_label", sa.String(length=80), nullable=False),
        sa.Column("category", sa.String(length=120), nullable=False),
        sa.Column("source", sa.String(length=64), nullable=False),
        sa.Column("source_product_id", sa.String(length=255), nullable=True),
        sa.Column("image_url", sa.String(length=1024), nullable=True),
        sa.Column("product_url", sa.String(length=1024), nullable=True),
        sa.Column("average_price", sa.Float(), nullable=False),
        sa.Column("opportunity_score", sa.Float(), nullable=False),
        sa.Column("estimated_margin_percent", sa.Float(), nullable=False),
        sa.Column("estimated_profit", sa.Float(), nullable=False),
        sa.Column("conversion_probability", sa.Float(), nullable=False),
        sa.Column("competition_score", sa.Float(), nullable=False),
        sa.Column("risk_score", sa.Float(), nullable=False),
        sa.Column("score_breakdown", sa.JSON(), nullable=False),
        sa.Column("decision_factors", sa.JSON(), nullable=False),
        sa.Column("warnings", sa.JSON(), nullable=False),
        sa.Column("recommended_strategy", sa.Text(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["run_id"], ["recommendation_runs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_recommendation_run_items_id", "recommendation_run_items", ["id"], unique=False)
    op.create_index("ix_recommendation_run_items_marketplace", "recommendation_run_items", ["marketplace"], unique=False)
    op.create_index("ix_recommendation_run_items_niche", "recommendation_run_items", ["niche"], unique=False)
    op.create_index("ix_recommendation_run_items_product", "recommendation_run_items", ["product_id", "source", "source_product_id"], unique=False)
    op.create_index("ix_recommendation_run_items_product_id", "recommendation_run_items", ["product_id"], unique=False)
    op.create_index("ix_recommendation_run_items_rank", "recommendation_run_items", ["run_id", "rank"], unique=False)
    op.create_index("ix_recommendation_run_items_run_id", "recommendation_run_items", ["run_id"], unique=False)

    op.create_table(
        "recommendation_usage",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("period_month", sa.String(length=7), nullable=False),
        sa.Column("generated_count", sa.Integer(), nullable=False),
        sa.Column("last_generated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "period_month", name="uq_recommendation_usage_user_period"),
    )
    op.create_index("ix_recommendation_usage_id", "recommendation_usage", ["id"], unique=False)
    op.create_index("ix_recommendation_usage_period_month", "recommendation_usage", ["period_month"], unique=False)
    op.create_index("ix_recommendation_usage_user_id", "recommendation_usage", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_recommendation_usage_user_id", table_name="recommendation_usage")
    op.drop_index("ix_recommendation_usage_period_month", table_name="recommendation_usage")
    op.drop_index("ix_recommendation_usage_id", table_name="recommendation_usage")
    op.drop_table("recommendation_usage")

    op.drop_index("ix_recommendation_run_items_run_id", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_rank", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_product_id", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_product", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_niche", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_marketplace", table_name="recommendation_run_items")
    op.drop_index("ix_recommendation_run_items_id", table_name="recommendation_run_items")
    op.drop_table("recommendation_run_items")

    op.drop_index("ix_recommendation_runs_user_id", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_user_created", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_profile", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_operation_type", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_niche", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_marketplace", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_investment_range", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_id", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_goal", table_name="recommendation_runs")
    op.drop_index("ix_recommendation_runs_created_at", table_name="recommendation_runs")
    op.drop_table("recommendation_runs")

    op.drop_index("ix_billing_subscriptions_user_id", table_name="billing_subscriptions")
    op.drop_index("ix_billing_subscriptions_stripe_subscription_id", table_name="billing_subscriptions")
    op.drop_index("ix_billing_subscriptions_stripe_price_id", table_name="billing_subscriptions")
    op.drop_index("ix_billing_subscriptions_stripe_customer_id", table_name="billing_subscriptions")
    op.drop_index("ix_billing_subscriptions_status", table_name="billing_subscriptions")
    op.drop_index("ix_billing_subscriptions_id", table_name="billing_subscriptions")
    op.drop_table("billing_subscriptions")

    op.drop_index("ix_user_sessions_user_id", table_name="user_sessions")
    op.drop_index("ix_user_sessions_token_hash", table_name="user_sessions")
    op.drop_index("ix_user_sessions_id", table_name="user_sessions")
    op.drop_index("ix_user_sessions_expires_at", table_name="user_sessions")
    op.drop_index("ix_user_sessions_active_lookup", table_name="user_sessions")
    op.drop_table("user_sessions")

    op.drop_index("ix_users_id", table_name="users")
    op.drop_index("ix_users_google_sub", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
