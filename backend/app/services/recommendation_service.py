from __future__ import annotations

from app.data_providers.product_provider import get_provider
from app.schemas.recommendation_schema import (
    RecommendationItem,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.explanation_service import build_explanation, build_strategy, target_audience_for
from app.services.explanation_service import build_decision_factors, build_warnings
from app.services.profit_service import calculate_product_profit
from app.services.scoring_service import (
    budget_compatibility_threshold,
    calculate_competition_score,
    calculate_investment_fit,
    calculate_conversion_probability,
    calculate_opportunity_score,
    calculate_risk_score,
)


def generate_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    products = get_provider().list_products()
    same_niche_matches = [product for product in products if product.niche == request.niche]
    exact_matches = [
        product
        for product in same_niche_matches
        if product.marketplace == request.marketplace
    ]

    # Nicho e uma restricao dura. Marketplace pode flexibilizar, mas nunca
    # recomendamos um produto fora do nicho escolhido pelo cliente.
    filtered = exact_matches or same_niche_matches
    if not filtered:
        return RecommendationResponse(
            profile=request,
            total_candidates=0,
            recommendations=[],
            applied_filters={
                "marketplace": request.marketplace,
                "niche": request.niche,
                "niche_strict": "true",
            },
            message="Nenhum produto encontrado no nicho informado.",
        )

    threshold = budget_compatibility_threshold(request)
    expanded_for_budget = False
    if exact_matches:
        compatible_exact_count = sum(
            1 for product in exact_matches if calculate_investment_fit(product, request) >= threshold
        )
        if compatible_exact_count < request.limit:
            seen_ids = {product.id for product in filtered}
            compatible_count = compatible_exact_count

            if compatible_count < request.limit:
                for product in same_niche_matches:
                    if product.id in seen_ids:
                        continue
                    if calculate_investment_fit(product, request) < threshold:
                        continue
                    filtered.append(product)
                    seen_ids.add(product.id)
                    compatible_count += 1
                    expanded_for_budget = True
                    if compatible_count >= request.limit:
                        break

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

    recommendations.sort(
        key=lambda item: (
            item.score_breakdown.get("investment_fit", 0) >= threshold,
            item.opportunity_score,
        ),
        reverse=True,
    )
    recommendations = [
        item for item in recommendations if item.product.niche == request.niche
    ]
    applied_filters = {
        "marketplace": request.marketplace,
        "niche": request.niche,
        "niche_strict": "true",
    }
    if expanded_for_budget:
        applied_filters["marketplace_expansion"] = "same_niche_only"

    viable_recommendations = [
        item for item in recommendations if item.score_breakdown.get("investment_fit", 0) >= threshold
    ]
    if viable_recommendations:
        recommendations = viable_recommendations
        applied_filters["budget_filter"] = "compatible_only"
    elif request.operation_type != "affiliate":
        return RecommendationResponse(
            profile=request,
            total_candidates=len(filtered),
            recommendations=[],
            applied_filters={
                **applied_filters,
                "budget_filter": "no_compatible_products",
            },
            message=(
                "Encontrei produtos no nicho informado, mas nenhum compativel com a faixa "
                "de investimento e tipo de operacao escolhidos."
            ),
        )

    return RecommendationResponse(
        profile=request,
        total_candidates=len(filtered),
        recommendations=recommendations[: request.limit],
        applied_filters=applied_filters,
    )
