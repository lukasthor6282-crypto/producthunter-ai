from __future__ import annotations

from typing import Any

from app.services.explanation_service import reason_for, strategy_for, target_audience_for
from app.utils.normalization import clamp, log_scale, normalize_range, safe_divide, soft_round


BASE_WEIGHTS = {
    "profit": 0.16,
    "margin": 0.16,
    "demand": 0.14,
    "trend": 0.13,
    "low_competition": 0.12,
    "reviews": 0.07,
    "low_risk": 0.12,
    "conversion": 0.10,
}


def weights_for_profile(profile: dict[str, Any]) -> dict[str, float]:
    weights = dict(BASE_WEIGHTS)
    operation = profile.get("operation_type", "").lower()
    goal = profile.get("goal", "").lower()

    if "afiliado" in operation:
        weights.update({"conversion": 0.19, "demand": 0.17, "profit": 0.08, "trend": 0.16, "low_risk": 0.10})
    elif "drop" in operation:
        weights.update({"low_risk": 0.20, "margin": 0.15, "demand": 0.13, "low_competition": 0.14})
    elif "revendedor" in operation:
        weights.update({"profit": 0.18, "margin": 0.18, "demand": 0.17, "low_risk": 0.13})
    elif "loja" in operation:
        weights.update({"margin": 0.17, "reviews": 0.11, "trend": 0.12, "low_risk": 0.15, "conversion": 0.13})

    if "lucro" in goal or "ticket" in goal:
        weights["profit"] += 0.08
        weights["margin"] += 0.04
    if "convers" in goal:
        weights["conversion"] += 0.10
        weights["reviews"] += 0.03
    if "concorr" in goal:
        weights["low_competition"] += 0.12
    if "viral" in goal or "conteudo" in goal:
        weights["trend"] += 0.10
        weights["demand"] += 0.04
    if "risco" in goal or "iniciante" in goal:
        weights["low_risk"] += 0.09

    total = sum(weights.values())
    return {key: value / total for key, value in weights.items()}


def financials_for_product(product: dict[str, Any]) -> dict[str, float]:
    price = float(product["average_price"])
    fee = price * float(product["marketplace_fee_percent"])
    tax = price * float(product["estimated_tax_percent"])
    total_cost = (
        float(product["estimated_cost"])
        + fee
        + float(product["shipping_cost"])
        + float(product["packaging_cost"])
        + tax
    )
    profit = price - total_cost
    margin = safe_divide(profit, price)
    affiliate_earning = price * float(product["affiliate_commission_percent"])
    return {
        "platform_fee": fee,
        "estimated_tax": tax,
        "total_cost": total_cost,
        "estimated_profit": profit,
        "estimated_margin": margin,
        "affiliate_earning": affiliate_earning,
    }


def competition_level(competitors: int) -> str:
    if competitors < 70:
        return "Baixa"
    if competitors < 170:
        return "Media"
    return "Alta"


def conversion_probability(product: dict[str, Any], profile: dict[str, Any]) -> float:
    rating = normalize_range(float(product["rating_average"]), 3.0, 5.0)
    review_signal = normalize_range(log_scale(float(product["review_count"])), 1, 4)
    demand = normalize_range(float(product["search_volume"]), 1000, 90000)
    trend = float(product["trend_score"]) / 100
    competition_penalty = normalize_range(float(product["competitor_count"]), 25, 320)
    return_penalty = float(product["return_risk"])
    experience = profile.get("experience_level", "").lower()
    beginner_modifier = -0.015 if "iniciante" in experience and return_penalty > 0.35 else 0.0
    raw = 0.055 + rating * 0.065 + review_signal * 0.04 + demand * 0.05 + trend * 0.04
    raw -= competition_penalty * 0.035 + return_penalty * 0.035
    raw += beginner_modifier
    return clamp(raw, 0.035, 0.34)


def risk_score(product: dict[str, Any], margin: float) -> float:
    competition = normalize_range(float(product["competitor_count"]), 35, 310)
    rating_risk = 1 - normalize_range(float(product["rating_average"]), 3.2, 4.9)
    margin_risk = 1 - normalize_range(margin, 0.08, 0.44)
    trend_risk = 1 - float(product["trend_score"]) / 100
    seasonality = float(product["seasonality_score"])
    supplier_risk = 1 - float(product["supplier_reliability"])
    delivery_risk = normalize_range(float(product["delivery_time_days"]), 3, 24)
    return_risk = float(product["return_risk"])
    weighted = (
        competition * 0.17
        + rating_risk * 0.13
        + margin_risk * 0.17
        + trend_risk * 0.11
        + seasonality * 0.10
        + supplier_risk * 0.14
        + delivery_risk * 0.09
        + return_risk * 0.09
    )
    return clamp(weighted * 100, 0, 100)


def opportunity_score(product: dict[str, Any], profile: dict[str, Any], metrics: dict[str, float]) -> float:
    weights = weights_for_profile(profile)
    profit_signal = normalize_range(metrics["estimated_profit"], 4, 90)
    margin_signal = normalize_range(metrics["estimated_margin"], 0.06, 0.48)
    demand_signal = normalize_range(float(product["search_volume"]), 1200, 90000)
    trend_signal = float(product["trend_score"]) / 100
    competition_signal = 1 - normalize_range(float(product["competitor_count"]), 30, 320)
    review_signal = normalize_range(log_scale(float(product["review_count"])), 1, 4)
    risk_signal = 1 - metrics["risk_score"] / 100
    conversion_signal = normalize_range(metrics["conversion_probability"], 0.04, 0.32)

    score = (
        profit_signal * weights["profit"]
        + margin_signal * weights["margin"]
        + demand_signal * weights["demand"]
        + trend_signal * weights["trend"]
        + competition_signal * weights["low_competition"]
        + review_signal * weights["reviews"]
        + risk_signal * weights["low_risk"]
        + conversion_signal * weights["conversion"]
    )

    investment = profile.get("investment_range", "").lower()
    experience = profile.get("experience_level", "").lower()
    if "sem estoque" in investment and metrics["estimated_profit"] < 8:
        score -= 0.03
    if "ate" in investment and float(product["estimated_cost"]) > 120:
        score -= 0.08
    if "iniciante" in experience and metrics["risk_score"] > 55:
        score -= 0.07
    if profile.get("marketplace") and profile.get("marketplace") == product.get("marketplace"):
        score += 0.025
    if profile.get("niche") and profile.get("niche") == product.get("niche"):
        score += 0.035

    return clamp(score * 100, 0, 100)


def enrich_product(product: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    financials = financials_for_product(product)
    conversion = conversion_probability(product, profile)
    risk = risk_score(product, financials["estimated_margin"])
    metrics = {
        **financials,
        "conversion_probability": conversion,
        "risk_score": risk,
    }
    score = opportunity_score(product, profile, metrics)
    enriched = {
        **product,
        "opportunity_score": soft_round(score, 1),
        "estimated_margin": soft_round(financials["estimated_margin"], 4),
        "estimated_profit": soft_round(financials["estimated_profit"]),
        "conversion_probability": soft_round(conversion, 4),
        "competition_level": competition_level(int(product["competitor_count"])),
        "risk_score": soft_round(risk, 1),
        "best_for": profile.get("operation_type", "Vendedor"),
        "recommended_strategy": strategy_for(product, profile),
        "target_audience": target_audience_for(product),
        "affiliate_earning": soft_round(financials["affiliate_earning"]),
    }
    enriched["recommendation_reason"] = reason_for(product, profile, enriched)
    return enriched


def recommend_products(
    products: list[dict[str, Any]], profile: dict[str, Any], limit: int = 8
) -> list[dict[str, Any]]:
    filtered = [
        product
        for product in products
        if product.get("marketplace") == profile.get("marketplace") and product.get("niche") == profile.get("niche")
    ]
    if len(filtered) < max(3, limit // 2):
        filtered = [
            product
            for product in products
            if product.get("marketplace") == profile.get("marketplace") or product.get("niche") == profile.get("niche")
        ]
    enriched = [enrich_product(product, profile) for product in filtered]
    enriched.sort(key=lambda item: item["opportunity_score"], reverse=True)
    return enriched[:limit]

