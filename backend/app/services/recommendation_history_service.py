from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.auth_models import User
from app.models.billing_models import BillingSubscription
from app.models.recommendation_models import RecommendationRun, RecommendationRunItem, RecommendationUsage
from app.schemas.profile_schema import UserProfile
from app.schemas.recommendation_schema import (
    RecommendationHistoryItem,
    RecommendationHistoryProduct,
    RecommendationHistoryResponse,
    RecommendationRequest,
    RecommendationResponse,
    RecommendationUsageResponse,
)
from app.services.billing_service import PLAN_CATALOG


FREE_MONTHLY_RECOMMENDATIONS = 10


def current_period_month(now: datetime | None = None) -> str:
    now = now or datetime.now(timezone.utc)
    return now.strftime("%Y-%m")


def monthly_recommendation_limit(db: Session, user: User) -> int:
    subscription = db.scalar(select(BillingSubscription).where(BillingSubscription.user_id == user.id))
    if subscription and subscription.status in {"active", "trialing"}:
        return int(PLAN_CATALOG.get(subscription.plan_slug, {}).get("monthly_recommendations", FREE_MONTHLY_RECOMMENDATIONS))
    return FREE_MONTHLY_RECOMMENDATIONS


def get_or_create_usage(db: Session, user: User, period_month: str | None = None) -> RecommendationUsage:
    period_month = period_month or current_period_month()
    usage = db.scalar(
        select(RecommendationUsage).where(
            RecommendationUsage.user_id == user.id,
            RecommendationUsage.period_month == period_month,
        )
    )
    if usage is not None:
        return usage

    usage = RecommendationUsage(user_id=user.id, period_month=period_month)
    db.add(usage)
    db.flush()
    return usage


def increment_recommendation_usage(db: Session, user: User) -> RecommendationUsage:
    usage = get_or_create_usage(db, user)
    usage.generated_count += 1
    usage.last_generated_at = datetime.now(timezone.utc)
    return usage


def recommendation_usage_status(db: Session, user: User) -> RecommendationUsageResponse:
    usage = get_or_create_usage(db, user)
    monthly_limit = monthly_recommendation_limit(db, user)
    return RecommendationUsageResponse(
        period_month=usage.period_month,
        generated_count=usage.generated_count,
        monthly_limit=monthly_limit,
        remaining=max(0, monthly_limit - usage.generated_count),
    )


def save_recommendation_run(
    db: Session,
    user: User,
    request: RecommendationRequest,
    response: RecommendationResponse,
) -> RecommendationRun:
    run = RecommendationRun(
        user_id=user.id,
        operation_type=request.operation_type,
        marketplace=request.marketplace,
        niche=request.niche,
        goal=request.goal,
        investment_range=request.investment_range,
        experience_level=request.experience_level,
        traffic_type=request.traffic_type,
        requested_limit=request.limit,
        total_candidates=response.total_candidates,
        returned_count=len(response.recommendations),
        message=response.message,
        applied_filters=response.applied_filters,
    )
    db.add(run)
    db.flush()

    for rank, item in enumerate(response.recommendations, start=1):
        product = item.product
        db.add(
            RecommendationRunItem(
                run_id=run.id,
                rank=rank,
                product_id=product.id,
                product_name=product.name,
                marketplace=product.marketplace,
                marketplace_label=product.marketplace_label,
                niche=product.niche,
                niche_label=product.niche_label,
                category=product.category,
                source=product.source,
                source_product_id=product.source_product_id,
                image_url=product.image_url,
                product_url=product.product_url,
                average_price=product.average_price,
                opportunity_score=item.opportunity_score,
                estimated_margin_percent=item.estimated_margin_percent,
                estimated_profit=item.estimated_profit,
                conversion_probability=item.conversion_probability,
                competition_score=item.competition_score,
                risk_score=item.risk_score,
                score_breakdown=item.score_breakdown,
                decision_factors=item.decision_factors,
                warnings=item.warnings,
                recommended_strategy=item.recommended_strategy,
                explanation=item.explanation,
            )
        )

    increment_recommendation_usage(db, user)
    db.commit()
    db.refresh(run)
    return run


def list_recommendation_history(db: Session, user: User, limit: int = 20) -> RecommendationHistoryResponse:
    runs = db.scalars(
        select(RecommendationRun)
        .where(RecommendationRun.user_id == user.id)
        .order_by(RecommendationRun.created_at.desc())
        .limit(limit)
    ).all()

    items: list[RecommendationHistoryItem] = []
    for run in runs:
        top_item = run.items[0] if run.items else None
        saved_products = [
            RecommendationHistoryProduct(
                rank=item.rank,
                product_id=item.product_id,
                product_name=item.product_name,
                marketplace=item.marketplace,
                marketplace_label=item.marketplace_label,
                niche=item.niche,
                niche_label=item.niche_label,
                image_url=item.image_url,
                product_url=item.product_url,
                average_price=item.average_price,
                opportunity_score=item.opportunity_score,
                estimated_margin_percent=item.estimated_margin_percent,
                estimated_profit=item.estimated_profit,
                conversion_probability=item.conversion_probability,
                competition_score=item.competition_score,
                risk_score=item.risk_score,
            )
            for item in run.items
        ]
        items.append(
            RecommendationHistoryItem(
                id=run.id,
                created_at=run.created_at,
                profile=UserProfile(
                    operation_type=run.operation_type,
                    marketplace=run.marketplace,
                    niche=run.niche,
                    goal=run.goal,
                    investment_range=run.investment_range,
                    experience_level=run.experience_level,
                    traffic_type=run.traffic_type,
                ),
                total_candidates=run.total_candidates,
                returned_count=run.returned_count,
                message=run.message,
                top_product_name=top_item.product_name if top_item else None,
                top_product_marketplace=top_item.marketplace if top_item else None,
                top_product_niche=top_item.niche if top_item else None,
                top_opportunity_score=top_item.opportunity_score if top_item else None,
                items=saved_products,
            )
        )

    return RecommendationHistoryResponse(items=items)
