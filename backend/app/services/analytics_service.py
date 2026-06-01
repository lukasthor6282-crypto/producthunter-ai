import pandas as pd

from app.data_providers.simulated_provider import get_provider
from app.services.profit_service import calculate_product_profit
from app.services.scoring_service import (
    calculate_conversion_probability,
    calculate_risk_score,
)


def get_dashboard_analytics() -> dict:
    products = get_provider().list_products()
    rows = []
    for product in products:
        profit = calculate_product_profit(product)
        rows.append(
            {
                **product.model_dump(),
                "margin_percent": profit.margin_percent,
                "unit_profit": profit.unit_profit,
                "conversion_probability": calculate_conversion_probability(product),
                "risk_score": calculate_risk_score(product),
            }
        )

    frame = pd.DataFrame(rows)
    top_niches = (
        frame.groupby("niche_label")
        .agg(
            avg_margin=("margin_percent", "mean"),
            avg_conversion=("conversion_probability", "mean"),
            avg_risk=("risk_score", "mean"),
            products=("id", "count"),
        )
        .reset_index()
        .sort_values("avg_margin", ascending=False)
        .head(8)
    )
    marketplace_summary = (
        frame.groupby("marketplace_label")
        .agg(products=("id", "count"), avg_price=("average_price", "mean"), avg_trend=("trend_score", "mean"))
        .reset_index()
        .sort_values("avg_trend", ascending=False)
    )
    trend_series = (
        frame.groupby("niche_label")["trend_score"]
        .mean()
        .reset_index()
        .sort_values("trend_score", ascending=False)
        .head(10)
    )

    return {
        "total_products": int(frame["id"].count()),
        "average_margin": round(float(frame["margin_percent"].mean()), 2),
        "average_conversion": round(float(frame["conversion_probability"].mean()), 2),
        "average_risk": round(float(frame["risk_score"].mean()), 2),
        "top_niches": top_niches.round(2).to_dict(orient="records"),
        "marketplaces": marketplace_summary.round(2).to_dict(orient="records"),
        "trend_series": trend_series.round(2).to_dict(orient="records"),
    }
