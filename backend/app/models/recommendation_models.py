from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.auth_models import User, utcnow


class RecommendationRun(Base):
    __tablename__ = "recommendation_runs"
    __table_args__ = (
        Index("ix_recommendation_runs_user_created", "user_id", "created_at"),
        Index("ix_recommendation_runs_profile", "operation_type", "marketplace", "niche", "investment_range"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    operation_type: Mapped[str] = mapped_column(String(48), index=True, nullable=False)
    marketplace: Mapped[str] = mapped_column(String(48), index=True, nullable=False)
    niche: Mapped[str] = mapped_column(String(48), index=True, nullable=False)
    goal: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    investment_range: Mapped[str] = mapped_column(String(48), index=True, nullable=False)
    experience_level: Mapped[str] = mapped_column(String(48), nullable=False)
    traffic_type: Mapped[str] = mapped_column(String(48), nullable=False)
    requested_limit: Mapped[int] = mapped_column(Integer, nullable=False)
    total_candidates: Mapped[int] = mapped_column(Integer, nullable=False)
    returned_count: Mapped[int] = mapped_column(Integer, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    applied_filters: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True, nullable=False)

    user: Mapped[User] = relationship(backref="recommendation_runs")
    items: Mapped[list["RecommendationRunItem"]] = relationship(
        back_populates="run",
        cascade="all, delete-orphan",
        order_by="RecommendationRunItem.rank",
    )


class RecommendationRunItem(Base):
    __tablename__ = "recommendation_run_items"
    __table_args__ = (
        Index("ix_recommendation_run_items_product", "product_id", "source", "source_product_id"),
        Index("ix_recommendation_run_items_rank", "run_id", "rank"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    run_id: Mapped[int] = mapped_column(ForeignKey("recommendation_runs.id", ondelete="CASCADE"), index=True, nullable=False)
    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    marketplace: Mapped[str] = mapped_column(String(48), index=True, nullable=False)
    marketplace_label: Mapped[str] = mapped_column(String(80), nullable=False)
    niche: Mapped[str] = mapped_column(String(48), index=True, nullable=False)
    niche_label: Mapped[str] = mapped_column(String(80), nullable=False)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    source: Mapped[str] = mapped_column(String(64), nullable=False)
    source_product_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    product_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    average_price: Mapped[float] = mapped_column(Float, nullable=False)
    opportunity_score: Mapped[float] = mapped_column(Float, nullable=False)
    estimated_margin_percent: Mapped[float] = mapped_column(Float, nullable=False)
    estimated_profit: Mapped[float] = mapped_column(Float, nullable=False)
    conversion_probability: Mapped[float] = mapped_column(Float, nullable=False)
    competition_score: Mapped[float] = mapped_column(Float, nullable=False)
    risk_score: Mapped[float] = mapped_column(Float, nullable=False)
    score_breakdown: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    decision_factors: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    warnings: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    recommended_strategy: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)

    run: Mapped[RecommendationRun] = relationship(back_populates="items")


class RecommendationUsage(Base):
    __tablename__ = "recommendation_usage"
    __table_args__ = (
        UniqueConstraint("user_id", "period_month", name="uq_recommendation_usage_user_period"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    period_month: Mapped[str] = mapped_column(String(7), index=True, nullable=False)
    generated_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_generated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    user: Mapped[User] = relationship(backref="recommendation_usage")
