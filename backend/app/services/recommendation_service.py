from __future__ import annotations

from typing import Any

from app.services.explanation_service import narrative_for
from app.services.scoring_service import recommend_products, weights_for_profile


def analyze_profile(products: list[dict[str, Any]], profile: dict[str, Any]) -> dict[str, Any]:
    matching = [
        item
        for item in products
        if item.get("marketplace") == profile.get("marketplace") and item.get("niche") == profile.get("niche")
    ]
    notes = [
        "Pesos ajustados por tipo de operacao, objetivo, investimento e experiencia.",
        "Dados simulados: use como estudo de MVP, nao como decisao financeira real.",
    ]
    if len(matching) < 3:
        notes.append("Poucos produtos no filtro exato; o ranking pode ampliar marketplace ou nicho.")
    return {
        "normalized_profile": profile,
        "scoring_weights": weights_for_profile(profile),
        "matching_products": len(matching),
        "notes": notes,
    }


def generate_recommendations(
    products: list[dict[str, Any]], profile: dict[str, Any], limit: int
) -> dict[str, Any]:
    recommended = recommend_products(products, profile, limit)
    top_product = recommended[0] if recommended else None
    return {
        "profile": profile,
        "narrative": narrative_for(profile, top_product),
        "recommended_products": recommended,
    }

