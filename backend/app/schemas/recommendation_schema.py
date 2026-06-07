from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.product_schema import Product
from app.schemas.profile_schema import UserProfile


class RecommendationRequest(UserProfile):
    limit: int = Field(default=8, ge=1, le=30)


class RecommendationItem(BaseModel):
    product: Product
    opportunity_score: float
    estimated_margin_percent: float
    estimated_profit: float
    conversion_probability: float
    competition_score: float
    risk_score: float
    recommended_strategy: str
    target_audience: str
    explanation: str
    score_breakdown: dict[str, float]
    decision_factors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class RecommendationResponse(BaseModel):
    profile: UserProfile
    total_candidates: int
    recommendations: list[RecommendationItem]
    applied_filters: dict[str, str] = Field(default_factory=dict)
    message: str = "Ranking gerado com sucesso."


class RecommendationHistoryProduct(BaseModel):
    rank: int
    product_id: int
    product_name: str
    marketplace: str
    marketplace_label: str
    niche: str
    niche_label: str
    image_url: str | None = None
    product_url: str | None = None
    average_price: float
    opportunity_score: float
    estimated_margin_percent: float
    estimated_profit: float
    conversion_probability: float
    competition_score: float
    risk_score: float


class RecommendationHistoryItem(BaseModel):
    id: int
    created_at: datetime
    profile: UserProfile
    total_candidates: int
    returned_count: int
    message: str
    top_product_name: str | None = None
    top_product_marketplace: str | None = None
    top_product_niche: str | None = None
    top_opportunity_score: float | None = None
    items: list[RecommendationHistoryProduct] = Field(default_factory=list)


class RecommendationHistoryResponse(BaseModel):
    items: list[RecommendationHistoryItem]


class RecommendationUsageResponse(BaseModel):
    period_month: str
    plan_slug: str
    plan_name: str
    generated_count: int
    monthly_limit: int
    remaining: int
    max_results_per_analysis: int
    usage_percent: float
    limit_reached: bool
    upgrade_recommended: bool
