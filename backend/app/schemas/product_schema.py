from __future__ import annotations

from pydantic import BaseModel, Field


class ProductOut(BaseModel):
    product_id: str
    product_name: str
    marketplace: str
    niche: str
    category: str
    average_price: float
    min_price: float
    max_price: float
    estimated_cost: float
    marketplace_fee_percent: float
    shipping_cost: float
    packaging_cost: float
    estimated_tax_percent: float
    affiliate_commission_percent: float
    competitor_count: int
    search_volume: int
    trend_score: float
    rating_average: float
    review_count: int
    sales_velocity: float
    return_risk: float
    seasonality_score: float
    product_weight: float
    supplier_reliability: float
    delivery_time_days: int


class ProductListResponse(BaseModel):
    total: int
    products: list[ProductOut]


class ProductCompareRequest(BaseModel):
    product_ids: list[str] = Field(min_length=2, max_length=5)
    operation_type: str = "Vendedor"
    goal: str = "Maior lucro"
    investment_range: str = "R$ 500 a R$ 2.000"
    experience_level: str = "Iniciante"
    traffic_type: str = "Marketplace"


class ComparedProduct(ProductOut):
    opportunity_score: float
    estimated_margin: float
    estimated_profit: float
    conversion_probability: float
    risk_score: float
    competition_level: str
    recommendation_reason: str


class ProductCompareResponse(BaseModel):
    winner_product_id: str | None
    summary: str
    products: list[ComparedProduct]

