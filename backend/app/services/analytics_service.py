from __future__ import annotations

from typing import Any

from app.services.scoring_service import enrich_product


DEFAULT_PROFILE = {
    "operation_type": "Vendedor",
    "marketplace": "Shopee",
    "niche": "Tecnologia",
    "goal": "Maior lucro",
    "investment_range": "R$ 500 a R$ 2.000",
    "experience_level": "Iniciante",
    "traffic_type": "Marketplace",
}


def dashboard_summary(products: list[dict[str, Any]]) -> dict[str, Any]:
    enriched = [enrich_product(product, DEFAULT_PROFILE) for product in products]
    top = sorted(enriched, key=lambda item: item["opportunity_score"], reverse=True)[:8]
    best_margin = sorted(enriched, key=lambda item: item["estimated_margin"], reverse=True)[:6]
    low_competition = sorted(enriched, key=lambda item: item["competitor_count"])[:6]
    high_conversion = sorted(enriched, key=lambda item: item["conversion_probability"], reverse=True)[:6]

    niche_scores: dict[str, list[float]] = {}
    for item in enriched:
        niche_scores.setdefault(item["niche"], []).append(float(item["opportunity_score"]))
    heated_niches = [
        {"niche": niche, "score": round(sum(scores) / len(scores), 1)}
        for niche, scores in sorted(niche_scores.items(), key=lambda pair: sum(pair[1]) / len(pair[1]), reverse=True)
    ][:7]

    return {
        "market_score": round(sum(item["opportunity_score"] for item in enriched) / len(enriched), 1),
        "opportunities_today": top,
        "trending_products": sorted(enriched, key=lambda item: item["trend_score"], reverse=True)[:6],
        "heated_niches": heated_niches,
        "best_margin_products": best_margin,
        "low_competition_products": low_competition,
        "high_conversion_products": high_conversion,
        "trend_alerts": [
            "TikTok Shop mostra forte tracao em produtos demonstraveis em video curto.",
            "Produtos leves e com baixo risco logistico tendem a performar melhor para iniciantes.",
            "Nichos com prova social alta reduzem risco de criativos pagos no MVP.",
        ],
    }

