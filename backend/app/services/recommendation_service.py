from __future__ import annotations

from app.data_providers.simulated_provider import get_provider
from app.schemas.recommendation_schema import (
    RecommendationItem,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.explanation_service import build_explanation, build_strategy, target_audience_for
from app.services.explanation_service import build_decision_factors, build_warnings
from app.services.profit_service import calculate_product_profit
from app.services.scoring_service import (
    calculate_competition_score,
    calculate_conversion_probability,
    calculate_opportunity_score,
    calculate_risk_score,
)


def generate_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    products = get_provider().list_products()
    filtered = [
        product
        for product in products
        if product.marketplace == request.marketplace and product.niche == request.niche
    ]

    if not filtered:
        filtered = [
            product
            for product in products
            if product.marketplace == request.marketplace or product.niche == request.niche
        ]
    if not filtered:
        return RecommendationResponse(
            profile=request,
            total_candidates=0,
            recommendations=[],
            applied_filters={"marketplace": request.marketplace, "niche": request.niche},
            message="Nenhum produto encontrado para os filtros informados.",
        )

    recommendations: list[RecommendationItem] = []
    for product in filtered:
        profit = calculate_product_profit(product)
        conversion = calculate_conversion_probability(product)
        competition = calculate_competition_score(product)
        risk = calculate_risk_score(product, request)
        score, breakdown = calculate_opportunity_score(product, request)
        estimated_profit = profit.unit_profit

        if request.operation_type == "affiliate":
            estimated_profit = round(product.average_price * product.affiliate_commission_percent, 2)

        decision_factors = build_decision_factors(
            product=product,
            score_breakdown=breakdown,
            margin_percent=profit.margin_percent,
            conversion_probability=conversion,
            risk_score=risk,
        )
        warnings = build_warnings(product, risk, breakdown)

        recommendations.append(
            RecommendationItem(
                product=product,
                opportunity_score=score,
                estimated_margin_percent=profit.margin_percent,
                estimated_profit=estimated_profit,
                conversion_probability=conversion,
                competition_score=competition,
                risk_score=risk,
                recommended_strategy=build_strategy(product, request, breakdown),
                target_audience=target_audience_for(product),
                explanation=build_explanation(
                    product=product,
                    profile=request,
                    opportunity_score=score,
                    margin_percent=profit.margin_percent,
                    conversion_probability=conversion,
                    risk_score=risk,
                    score_breakdown=breakdown,
                ),
                score_breakdown=breakdown,
                decision_factors=decision_factors,
                warnings=warnings,
            )
        )

    recommendations.sort(key=lambda item: item.opportunity_score, reverse=True)
    return RecommendationResponse(
        profile=request,
        total_candidates=len(filtered),
        recommendations=recommendations[: request.limit],
        applied_filters={"marketplace": request.marketplace, "niche": request.niche},
    )
