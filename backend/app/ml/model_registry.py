from __future__ import annotations

from typing import Any

import pandas as pd

from app.data_providers.simulated_provider import SimulatedMarketplaceProvider
from app.ml.features import TARGET_COLUMNS, product_profile_row
from app.ml.train_model import train_model
from app.services.scoring_service import enrich_product
from app.utils.normalization import soft_round

_registry: dict[str, Any] | None = None


def get_model_registry(products: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    global _registry
    if _registry is None:
        source_products = products or SimulatedMarketplaceProvider().list_products()
        _registry = train_model(source_products)
    return _registry


def predict_products(products: list[dict[str, Any]], profile: dict[str, Any], limit: int = 5) -> list[dict[str, Any]]:
    registry = get_model_registry(products)
    rows = [product_profile_row(product, profile) for product in products]
    predictions = registry["pipeline"].predict(pd.DataFrame(rows))
    output: list[dict[str, Any]] = []
    for product, predicted_values in zip(products, predictions, strict=False):
        fallback = enrich_product(product, profile)
        prediction_map = dict(zip(TARGET_COLUMNS, predicted_values, strict=False))
        output.append(
            {
                "product_id": product["product_id"],
                "product_name": product["product_name"],
                "conversion_probability": soft_round(max(0.0, prediction_map["conversion_probability"]), 4),
                "estimated_margin": soft_round(prediction_map["estimated_margin"], 4),
                "estimated_profit": soft_round(prediction_map["estimated_profit"]),
                "opportunity_score": soft_round(max(0.0, min(100.0, prediction_map["opportunity_score"])), 1),
                "risk_score": soft_round(max(0.0, min(100.0, prediction_map["risk_score"])), 1),
                "rule_based_score": fallback["opportunity_score"],
            }
        )
    output.sort(key=lambda item: item["opportunity_score"], reverse=True)
    return output[:limit]

