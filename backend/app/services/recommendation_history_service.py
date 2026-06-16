from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.auth_models import User
from app.models.recommendation_models import RecommendationRun, RecommendationRunItem, RecommendationUsage
from app.schemas.profile_schema import UserProfile
from app.schemas.recommendation_schema import (
    RecommendationHistoryItem,
    RecommendationHistoryProduct,
    RecommendationHistoryResponse,
    RecommendationInsightBucket,
    RecommendationInsightsResponse,
    RecommendationRequest,
    RecommendationResponse,
    RecommendationTopProductInsight,
    RecommendationUsageResponse,
)
from app.services.billing_service import active_plan_slug, plan_limits

ADMIN_MONTHLY_RECOMMENDATION_LIMIT = 999_999
ADMIN_MAX_RESULTS_PER_ANALYSIS = 30


def current_period_month(now: datetime | None = None) -> str:
    now = now or datetime.now(timezone.utc)
    return now.strftime("%Y-%m")


def monthly_recommendation_limit(db: Session, user: User) -> int:
    if user.is_admin:
        return ADMIN_MONTHLY_RECOMMENDATION_LIMIT
    limits = plan_limits(active_plan_slug(db, user))
    return int(limits["monthly_recommendations"])


def recommendation_plan_limits(db: Session, user: User) -> dict:
    if user.is_admin:
        return {
            "plan_slug": "admin",
            "plan_name": "Admin",
            "monthly_recommendations": ADMIN_MONTHLY_RECOMMENDATION_LIMIT,
            "max_results_per_analysis": ADMIN_MAX_RESULTS_PER_ANALYSIS,
            "history_retention_days": 3650,
        }
    return plan_limits(active_plan_slug(db, user))


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
    if user.is_admin:
        return usage
    usage.generated_count += 1
    usage.last_generated_at = datetime.now(timezone.utc)
    return usage


def recommendation_usage_status(db: Session, user: User) -> RecommendationUsageResponse:
    usage = get_or_create_usage(db, user)
    limits = recommendation_plan_limits(db, user)
    monthly_limit = int(limits["monthly_recommendations"])
    remaining = max(0, monthly_limit - usage.generated_count)
    usage_percent = (
        0.0
        if user.is_admin
        else round(min(100, (usage.generated_count / monthly_limit) * 100), 2)
        if monthly_limit
        else 100.0
    )
    return RecommendationUsageResponse(
        period_month=usage.period_month,
        plan_slug=str(limits["plan_slug"]),
        plan_name=str(limits["plan_name"]),
        generated_count=usage.generated_count,
        monthly_limit=monthly_limit,
        remaining=remaining,
        max_results_per_analysis=int(limits["max_results_per_analysis"]),
        usage_percent=usage_percent,
        limit_reached=False if user.is_admin else remaining <= 0,
        upgrade_recommended=False if user.is_admin else remaining <= max(1, int(monthly_limit * 0.1)),
    )


def ensure_recommendation_quota(db: Session, user: User, requested_limit: int) -> None:
    usage = recommendation_usage_status(db, user)
    if requested_limit > usage.max_results_per_analysis:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail={
                "code": "PLAN_RESULT_LIMIT_EXCEEDED",
                "message": (
                    f"Seu plano {usage.plan_name} permite ate {usage.max_results_per_analysis} produtos por analise. "
                    "Reduza a quantidade ou faca upgrade."
                ),
                "plan_slug": usage.plan_slug,
                "plan_name": usage.plan_name,
                "max_results_per_analysis": usage.max_results_per_analysis,
            },
        )

    if usage.remaining <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "code": "PLAN_MONTHLY_LIMIT_REACHED",
                "message": (
                    f"Voce atingiu o limite mensal do plano {usage.plan_name}: "
                    f"{usage.generated_count} de {usage.monthly_limit} analises usadas neste periodo."
                ),
                "plan_slug": usage.plan_slug,
                "plan_name": usage.plan_name,
                "period_month": usage.period_month,
                "generated_count": usage.generated_count,
                "monthly_limit": usage.monthly_limit,
                "remaining": usage.remaining,
            },
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
                image_urls=product.image_urls,
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
        .options(selectinload(RecommendationRun.items))
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
                image_urls=_history_image_urls(item.image_url, item.image_urls),
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


def recommendation_insights(db: Session, user: User, limit: int = 5) -> RecommendationInsightsResponse:
    total_runs = db.scalar(
        select(func.count(RecommendationRun.id)).where(RecommendationRun.user_id == user.id)
    ) or 0
    total_saved_products = db.scalar(
        select(func.count(RecommendationRunItem.id))
        .join(RecommendationRun, RecommendationRunItem.run_id == RecommendationRun.id)
        .where(RecommendationRun.user_id == user.id)
    ) or 0

    score_summary = db.execute(
        select(
            func.coalesce(func.avg(RecommendationRunItem.opportunity_score), 0),
            func.coalesce(func.max(RecommendationRunItem.opportunity_score), 0),
        )
        .join(RecommendationRun, RecommendationRunItem.run_id == RecommendationRun.id)
        .where(RecommendationRun.user_id == user.id)
    ).one()

    return RecommendationInsightsResponse(
        total_runs=int(total_runs),
        total_saved_products=int(total_saved_products),
        average_opportunity_score=round(float(score_summary[0] or 0), 2),
        best_opportunity_score=round(float(score_summary[1] or 0), 2),
        top_niches=_insight_buckets(db, user, "niche", "niche_label", limit),
        top_marketplaces=_insight_buckets(db, user, "marketplace", "marketplace_label", limit),
        top_products=_top_product_insights(db, user, limit),
    )


def _insight_buckets(
    db: Session,
    user: User,
    key_column_name: str,
    label_column_name: str,
    limit: int,
) -> list[RecommendationInsightBucket]:
    item = RecommendationRunItem
    key_column = getattr(item, key_column_name)
    label_column = getattr(item, label_column_name)
    total_recommendations = func.count(item.id).label("total_recommendations")
    average_score = func.coalesce(func.avg(item.opportunity_score), 0).label("average_opportunity_score")
    best_score = func.coalesce(func.max(item.opportunity_score), 0).label("best_opportunity_score")
    average_profit = func.coalesce(func.avg(item.estimated_profit), 0).label("average_estimated_profit")

    rows = db.execute(
        select(
            key_column,
            label_column,
            total_recommendations,
            average_score,
            best_score,
            average_profit,
        )
        .join(RecommendationRun, item.run_id == RecommendationRun.id)
        .where(RecommendationRun.user_id == user.id)
        .group_by(key_column, label_column)
        .order_by(total_recommendations.desc(), average_score.desc())
        .limit(limit)
    ).all()

    return [
        RecommendationInsightBucket(
            key=str(row[0]),
            label=str(row[1]),
            total_recommendations=int(row[2] or 0),
            average_opportunity_score=round(float(row[3] or 0), 2),
            best_opportunity_score=round(float(row[4] or 0), 2),
            average_estimated_profit=round(float(row[5] or 0), 2),
        )
        for row in rows
    ]


def _top_product_insights(db: Session, user: User, limit: int) -> list[RecommendationTopProductInsight]:
    item = RecommendationRunItem
    average_price = func.coalesce(func.avg(item.average_price), 0).label("average_price")
    appearances = func.count(item.id).label("appearances")
    average_score = func.coalesce(func.avg(item.opportunity_score), 0).label("average_opportunity_score")
    best_score = func.coalesce(func.max(item.opportunity_score), 0).label("best_opportunity_score")
    average_profit = func.coalesce(func.avg(item.estimated_profit), 0).label("average_estimated_profit")

    rows = db.execute(
        select(
            item.product_id,
            item.product_name,
            item.marketplace,
            item.marketplace_label,
            item.niche,
            item.niche_label,
            item.image_url,
            item.product_url,
            average_price,
            appearances,
            average_score,
            best_score,
            average_profit,
        )
        .join(RecommendationRun, item.run_id == RecommendationRun.id)
        .where(RecommendationRun.user_id == user.id)
        .group_by(
            item.product_id,
            item.product_name,
            item.marketplace,
            item.marketplace_label,
            item.niche,
            item.niche_label,
            item.image_url,
            item.product_url,
        )
        .order_by(appearances.desc(), average_score.desc())
        .limit(limit)
    ).all()

    return [
        RecommendationTopProductInsight(
            product_id=int(row[0]),
            product_name=str(row[1]),
            marketplace=str(row[2]),
            marketplace_label=str(row[3]),
            niche=str(row[4]),
            niche_label=str(row[5]),
            image_url=row[6],
            image_urls=_history_image_urls(row[6], None),
            product_url=row[7],
            average_price=round(float(row[8] or 0), 2),
            appearances=int(row[9] or 0),
            average_opportunity_score=round(float(row[10] or 0), 2),
            best_opportunity_score=round(float(row[11] or 0), 2),
            average_estimated_profit=round(float(row[12] or 0), 2),
        )
        for row in rows
    ]


def _history_image_urls(image_url: str | None, image_urls: list[str] | None) -> list[str]:
    urls = image_urls or []
    if image_url and image_url not in urls:
        urls = [image_url, *urls]
    return list(dict.fromkeys(urls))[:3]
