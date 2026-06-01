from __future__ import annotations

from dataclasses import dataclass

from app.schemas.product_schema import Product
from app.schemas.profile_schema import UserProfile
from app.services.profit_service import calculate_product_profit
from app.utils.constants import INVESTMENT_RANGES
from app.utils.normalization import clamp, normalize_range


@dataclass(frozen=True)
class ScoringContext:
    weights: dict[str, float]
    risk_tolerance: float
    max_unit_cost: float
    min_unit_cost: float
    investment_fit: float


OPERATION_WEIGHTS = {
    "affiliate": {
        "commission": 1.5,
        "conversion": 1.35,
        "ticket": 0.8,
        "trend": 1.15,
        "visual": 1.1,
        "risk_inverse": 1.0,
        "margin": 0.5,
        "profit": 0.45,
        "competition_inverse": 0.75,
        "sales_velocity": 0.85,
    },
    "seller": {
        "margin": 1.45,
        "profit": 1.35,
        "competition_inverse": 1.1,
        "sales_velocity": 1.05,
        "shipping_inverse": 0.75,
        "fee_inverse": 0.7,
        "risk_inverse": 1.05,
        "conversion": 0.9,
        "trend": 0.55,
    },
    "dropshipping": {
        "delivery_inverse": 1.35,
        "supplier": 1.45,
        "margin": 1.0,
        "risk_inverse": 1.1,
        "demand": 0.95,
        "weight_inverse": 0.9,
        "conversion": 0.85,
        "competition_inverse": 0.7,
    },
    "reseller": {
        "margin": 1.25,
        "profit": 1.15,
        "sales_velocity": 1.0,
        "competition_inverse": 0.95,
        "risk_inverse": 0.85,
        "conversion": 0.85,
        "demand": 0.75,
    },
    "own_store": {
        "margin": 1.3,
        "recurrence": 1.2,
        "kit": 1.0,
        "ticket": 0.9,
        "differentiation": 0.85,
        "profit": 1.05,
        "risk_inverse": 0.8,
        "conversion": 0.75,
    },
}

GOAL_BOOSTS = {
    "highest_profit": {"profit": 0.8, "margin": 0.35},
    "fast_turnover": {"sales_velocity": 0.8, "conversion": 0.45},
    "low_competition": {"competition_inverse": 1.0},
    "high_conversion": {"conversion": 0.95},
    "viral_product": {"trend": 0.85, "visual": 0.55},
    "high_ticket": {"ticket": 0.85, "profit": 0.3},
    "high_commission": {"commission": 1.0, "ticket": 0.25},
    "beginner_product": {"risk_inverse": 0.75, "competition_inverse": 0.4, "shipping_inverse": 0.25},
    "low_risk": {"risk_inverse": 1.0, "supplier": 0.35},
    "margin_and_conversion": {"margin": 0.65, "conversion": 0.65},
}

EXPERIENCE_RISK_TOLERANCE = {
    "beginner": 0.82,
    "intermediate": 0.95,
    "advanced": 1.08,
}

TRAFFIC_BOOSTS = {
    "marketplace": {"conversion": 0.25, "competition_inverse": 0.2},
    "paid_ads": {"margin": 0.3, "ticket": 0.25, "conversion": 0.15},
    "organic": {"trend": 0.25, "visual": 0.15},
    "social": {"trend": 0.45, "visual": 0.35},
    "influencer": {"commission": 0.35, "visual": 0.4, "ticket": 0.2},
}

MARKETPLACE_BOOSTS = {
    "mercado_livre": {"conversion": 0.18, "delivery_inverse": 0.15, "competition_inverse": -0.05},
    "amazon": {"supplier": 0.18, "conversion": 0.12, "fee_inverse": -0.04},
    "shopee": {"sales_velocity": 0.24, "ticket": -0.08, "trend": 0.12},
    "aliexpress": {"margin": 0.16, "delivery_inverse": -0.2, "supplier": 0.1},
    "tiktok_shop": {"trend": 0.32, "visual": 0.28, "conversion": 0.08},
    "magalu": {"supplier": 0.22, "ticket": 0.12, "fee_inverse": -0.08},
    "shein": {"visual": 0.26, "trend": 0.18, "ticket": -0.06},
}

NICHE_BOOSTS = {
    "technology": {"trend": 0.14, "ticket": 0.12, "return_risk_inverse": -0.04},
    "beauty": {"recurrence": 0.22, "visual": 0.14, "conversion": 0.1},
    "home": {"kit": 0.16, "risk_inverse": 0.06},
    "toys": {"seasonality_inverse": -0.06, "visual": 0.12},
    "pets": {"recurrence": 0.22, "risk_inverse": 0.08},
    "fashion": {"visual": 0.24, "trend": 0.18, "return_risk_inverse": -0.08},
    "tools": {"ticket": 0.1, "supplier": 0.1},
    "automotive": {"ticket": 0.08, "demand": 0.08},
    "decoration": {"visual": 0.2, "trend": 0.12},
    "health": {"supplier": 0.18, "risk_inverse": 0.1},
    "sports": {"trend": 0.12, "visual": 0.08},
    "games": {"ticket": 0.16, "trend": 0.18},
    "stationery": {"ticket": -0.12, "conversion": 0.12},
    "kitchen": {"kit": 0.16, "conversion": 0.1},
    "organization": {"visual": 0.16, "conversion": 0.12},
}


def get_investment_bounds(investment_range: str) -> tuple[float, float]:
    selected = next((item for item in INVESTMENT_RANGES if item["value"] == investment_range), None)
    if selected is None:
        return 0, 2000
    return float(selected["min"]), float(selected["max"])


def calculate_investment_fit(product: Product, profile: UserProfile) -> float:
    min_budget, max_budget = get_investment_bounds(profile.investment_range)
    # O MVP estima que o usuario precisa comprar ao menos 8 unidades para testar estoque.
    starter_batch_cost = product.estimated_cost * 8
    if starter_batch_cost <= max_budget:
        if starter_batch_cost >= min_budget * 0.25:
            return 100
        return 86
    over_budget_ratio = starter_batch_cost / max(max_budget, 1)
    return round(clamp(100 - ((over_budget_ratio - 1) * 90), 5, 100), 2)


def calculate_conversion_probability(product: Product) -> float:
    rating_score = normalize_range(product.average_rating, 3.0, 5.0) * 100
    review_score = normalize_range(product.reviews_count, 20, 3500) * 100
    demand_score = normalize_range(product.search_volume, 600, 22000) * 100
    competition_drag = normalize_range(product.competitors_count, 20, 420) * 100
    reliability = product.supplier_reliability
    conversion = (
        rating_score * 0.18
        + review_score * 0.12
        + demand_score * 0.18
        + product.trend_score * 0.18
        + product.sales_velocity * 0.22
        + reliability * 0.12
        - competition_drag * 0.12
    )
    return round(clamp(conversion, 5, 96), 2)


def calculate_competition_score(product: Product) -> float:
    competitor_pressure = normalize_range(product.competitors_count, 20, 420) * 100
    demand_offset = normalize_range(product.search_volume, 600, 22000) * 18
    return round(clamp(competitor_pressure - demand_offset + 12, 3, 98), 2)


def calculate_risk_score(product: Product, profile: UserProfile | None = None) -> float:
    delivery_risk = normalize_range(product.delivery_days, 2, 25) * 100
    weight_risk = normalize_range(product.product_weight_kg, 0.05, 4.0) * 100
    reliability_risk = 100 - product.supplier_reliability
    fee_pressure = normalize_range(product.platform_fee_percent, 0.07, 0.2) * 100
    competition_risk = calculate_competition_score(product)
    risk = (
        product.return_risk * 0.27
        + delivery_risk * 0.16
        + reliability_risk * 0.18
        + product.seasonality * 0.1
        + weight_risk * 0.08
        + fee_pressure * 0.07
        + competition_risk * 0.14
    )
    if profile:
        if profile.operation_type == "dropshipping":
            risk += delivery_risk * 0.12 + reliability_risk * 0.08
        if profile.operation_type == "affiliate":
            risk -= 8
        if profile.experience_level == "beginner":
            risk += 4
        if profile.goal == "low_risk":
            risk += product.return_risk * 0.08
    return round(clamp(risk, 2, 98), 2)


def build_score_breakdown(product: Product, profile: UserProfile) -> dict[str, float]:
    profit = calculate_product_profit(product)
    conversion = calculate_conversion_probability(product)
    competition = calculate_competition_score(product)
    risk = calculate_risk_score(product, profile)
    investment_fit = calculate_investment_fit(product, profile)

    return {
        "margin": clamp(profit.margin_percent * 2.2, 0, 100),
        "profit": normalize_range(profit.unit_profit, -25, 135) * 100,
        "conversion": conversion,
        "competition_inverse": 100 - competition,
        "risk_inverse": 100 - risk,
        "return_risk_inverse": 100 - product.return_risk,
        "seasonality_inverse": 100 - product.seasonality,
        "investment_fit": investment_fit,
        "commission": clamp(product.affiliate_commission_percent * 620, 0, 100),
        "ticket": normalize_range(product.average_price, 35, 380) * 100,
        "trend": product.trend_score,
        "visual": product.visual_appeal,
        "sales_velocity": product.sales_velocity,
        "shipping_inverse": 100 - normalize_range(product.estimated_shipping, 6, 34) * 100,
        "fee_inverse": 100 - normalize_range(product.platform_fee_percent, 0.07, 0.2) * 100,
        "delivery_inverse": 100 - normalize_range(product.delivery_days, 2, 25) * 100,
        "supplier": product.supplier_reliability,
        "demand": normalize_range(product.search_volume, 600, 22000) * 100,
        "weight_inverse": 100 - normalize_range(product.product_weight_kg, 0.05, 4.0) * 100,
        "recurrence": product.recurrence_score,
        "kit": product.kit_potential,
        "differentiation": (product.visual_appeal * 0.55) + ((100 - competition) * 0.45),
        "roi": normalize_range((profit.unit_profit / max(profit.unit_cost, 1)) * 100, -20, 120) * 100,
    }


def build_scoring_context(product: Product, profile: UserProfile) -> ScoringContext:
    weights = dict(OPERATION_WEIGHTS.get(profile.operation_type, OPERATION_WEIGHTS["seller"]))
    weights["investment_fit"] = weights.get("investment_fit", 0) + 0.75

    for signal, boost in GOAL_BOOSTS.get(profile.goal, {}).items():
        weights[signal] = weights.get(signal, 0) + boost

    for signal, boost in TRAFFIC_BOOSTS.get(profile.traffic_type, {}).items():
        weights[signal] = weights.get(signal, 0) + boost

    for signal, boost in MARKETPLACE_BOOSTS.get(profile.marketplace, {}).items():
        weights[signal] = weights.get(signal, 0) + boost

    for signal, boost in NICHE_BOOSTS.get(profile.niche, {}).items():
        weights[signal] = weights.get(signal, 0) + boost

    risk_tolerance = EXPERIENCE_RISK_TOLERANCE.get(profile.experience_level, 0.95)
    if profile.experience_level == "beginner":
        weights["risk_inverse"] = weights.get("risk_inverse", 0) + 0.35
        weights["competition_inverse"] = weights.get("competition_inverse", 0) + 0.2
        weights["investment_fit"] = weights.get("investment_fit", 0) + 0.25
    elif profile.experience_level == "advanced":
        weights["profit"] = weights.get("profit", 0) + 0.18
        weights["trend"] = weights.get("trend", 0) + 0.12

    min_unit_cost, max_budget = get_investment_bounds(profile.investment_range)
    return ScoringContext(
        weights={key: max(value, 0) for key, value in weights.items()},
        risk_tolerance=risk_tolerance,
        min_unit_cost=min_unit_cost,
        max_unit_cost=max_budget / 8,
        investment_fit=calculate_investment_fit(product, profile),
    )


def calculate_opportunity_score(product: Product, profile: UserProfile) -> tuple[float, dict[str, float]]:
    signals = build_score_breakdown(product, profile)
    context = build_scoring_context(product, profile)

    weighted_total = 0.0
    weight_sum = 0.0
    for signal, weight in context.weights.items():
        weighted_total += signals.get(signal, 0) * weight
        weight_sum += weight

    raw_score = weighted_total / max(weight_sum, 1)
    risk_penalty = (100 - signals["risk_inverse"]) * (1.0 - context.risk_tolerance) * 0.18
    investment_penalty = max(0, 72 - signals["investment_fit"]) * 0.22
    opportunity_score = clamp(raw_score - risk_penalty - investment_penalty, 1, 99)
    return round(opportunity_score, 2), {key: round(value, 2) for key, value in signals.items()}
