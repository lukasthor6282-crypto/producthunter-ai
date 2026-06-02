from __future__ import annotations

from typing import Any

import pandas as pd


NUMERIC_FEATURES = [
    "average_price",
    "min_price",
    "max_price",
    "estimated_cost",
    "marketplace_fee_percent",
    "shipping_cost",
    "packaging_cost",
    "estimated_tax_percent",
    "affiliate_commission_percent",
    "competitor_count",
    "search_volume",
    "trend_score",
    "rating_average",
    "review_count",
    "sales_velocity",
    "return_risk",
    "seasonality_score",
    "product_weight",
    "supplier_reliability",
    "delivery_time_days",
]

CATEGORICAL_FEATURES = [
    "category",
    "marketplace",
    "niche",
    "operation_type",
    "user_goal",
    "investment_range",
    "experience_level",
    "traffic_type",
]

TARGET_COLUMNS = [
    "conversion_probability",
    "estimated_margin",
    "estimated_profit",
    "opportunity_score",
    "risk_score",
]


def product_profile_row(product: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    row = {feature: product[feature] for feature in NUMERIC_FEATURES}
    row.update(
        {
            "category": product["category"],
            "marketplace": product["marketplace"],
            "niche": product["niche"],
            "operation_type": profile.get("operation_type", "Vendedor"),
            "user_goal": profile.get("goal", "Maior lucro"),
            "investment_range": profile.get("investment_range", "R$ 500 a R$ 2.000"),
            "experience_level": profile.get("experience_level", "Iniciante"),
            "traffic_type": profile.get("traffic_type", "Marketplace"),
        }
    )
    return row


def dataframe_from_rows(rows: list[dict[str, Any]]) -> pd.DataFrame:
    return pd.DataFrame(rows)

