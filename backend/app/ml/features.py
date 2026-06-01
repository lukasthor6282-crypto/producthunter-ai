from __future__ import annotations

import pandas as pd

from app.schemas.product_schema import Product
from app.schemas.profile_schema import UserProfile
from app.services.scoring_service import calculate_competition_score, calculate_investment_fit
from app.utils.constants import GOALS, MARKETPLACES, NICHES, OPERATION_TYPES, TRAFFIC_TYPES

OPERATION_VALUES = [item["value"] for item in OPERATION_TYPES]
GOAL_VALUES = [item["value"] for item in GOALS]
TRAFFIC_VALUES = [item["value"] for item in TRAFFIC_TYPES]
MARKETPLACE_VALUES = [item["value"] for item in MARKETPLACES]
NICHE_VALUES = [item["value"] for item in NICHES]


BASE_FEATURE_COLUMNS = [
    "average_price",
    "estimated_cost",
    "price_to_cost_ratio",
    "gross_spread",
    "platform_fee_percent",
    "estimated_shipping",
    "shipping_weight_pressure",
    "packaging_cost",
    "estimated_tax_percent",
    "affiliate_commission_percent",
    "competitors_count",
    "competition_score",
    "search_volume",
    "reviews_count",
    "demand_per_competitor",
    "trend_score",
    "average_rating",
    "sales_velocity",
    "return_risk",
    "seasonality",
    "product_weight_kg",
    "delivery_days",
    "supplier_reliability",
    "visual_appeal",
    "kit_potential",
    "recurrence_score",
    "investment_fit",
    "is_beginner",
    "is_intermediate",
    "is_advanced",
    "marketplace_match",
    "niche_match",
]

ONE_HOT_FEATURE_COLUMNS = (
    [f"operation_{value}" for value in OPERATION_VALUES]
    + [f"goal_{value}" for value in GOAL_VALUES]
    + [f"traffic_{value}" for value in TRAFFIC_VALUES]
    + [f"marketplace_{value}" for value in MARKETPLACE_VALUES]
    + [f"niche_{value}" for value in NICHE_VALUES]
)

FEATURE_COLUMNS = BASE_FEATURE_COLUMNS + ONE_HOT_FEATURE_COLUMNS


def product_to_feature_row(product: Product, profile: UserProfile) -> dict[str, float]:
    """Transforma produto + perfil em uma linha numerica para o modelo.

    Em Machine Learning, chamamos de *features* as informacoes de entrada que
    ajudam o algoritmo a aprender padroes. Aqui usamos atributos do produto
    (preco, custo, demanda, concorrencia etc.) e atributos do perfil
    (operacao, objetivo, trafego etc.).

    Repare que categorias como marketplace e objetivo precisam virar numeros.
    Para isso usamos one-hot encoding: uma coluna recebe 1 quando a categoria
    esta ativa e 0 quando nao esta.
    """
    demand_per_competitor = product.search_volume / max(product.competitors_count, 1)
    row = {
        "average_price": product.average_price,
        "estimated_cost": product.estimated_cost,
        "price_to_cost_ratio": product.average_price / max(product.estimated_cost, 1),
        "gross_spread": product.average_price - product.estimated_cost,
        "platform_fee_percent": product.platform_fee_percent,
        "estimated_shipping": product.estimated_shipping,
        "shipping_weight_pressure": product.estimated_shipping * product.product_weight_kg,
        "packaging_cost": product.packaging_cost,
        "estimated_tax_percent": product.estimated_tax_percent,
        "affiliate_commission_percent": product.affiliate_commission_percent,
        "competitors_count": float(product.competitors_count),
        "competition_score": calculate_competition_score(product),
        "search_volume": float(product.search_volume),
        "reviews_count": float(product.reviews_count),
        "demand_per_competitor": demand_per_competitor,
        "trend_score": product.trend_score,
        "average_rating": product.average_rating,
        "sales_velocity": product.sales_velocity,
        "return_risk": product.return_risk,
        "seasonality": product.seasonality,
        "product_weight_kg": product.product_weight_kg,
        "delivery_days": float(product.delivery_days),
        "supplier_reliability": product.supplier_reliability,
        "visual_appeal": product.visual_appeal,
        "kit_potential": product.kit_potential,
        "recurrence_score": product.recurrence_score,
        "investment_fit": calculate_investment_fit(product, profile),
        "is_beginner": float(profile.experience_level == "beginner"),
        "is_intermediate": float(profile.experience_level == "intermediate"),
        "is_advanced": float(profile.experience_level == "advanced"),
        "marketplace_match": float(product.marketplace == profile.marketplace),
        "niche_match": float(product.niche == profile.niche),
    }

    for value in OPERATION_VALUES:
        row[f"operation_{value}"] = float(profile.operation_type == value)
    for value in GOAL_VALUES:
        row[f"goal_{value}"] = float(profile.goal == value)
    for value in TRAFFIC_VALUES:
        row[f"traffic_{value}"] = float(profile.traffic_type == value)
    for value in MARKETPLACE_VALUES:
        row[f"marketplace_{value}"] = float(product.marketplace == value)
    for value in NICHE_VALUES:
        row[f"niche_{value}"] = float(product.niche == value)

    return row


def build_feature_frame(products: list[Product], profile: UserProfile) -> pd.DataFrame:
    frame = pd.DataFrame([product_to_feature_row(product, profile) for product in products])
    return frame[FEATURE_COLUMNS]
