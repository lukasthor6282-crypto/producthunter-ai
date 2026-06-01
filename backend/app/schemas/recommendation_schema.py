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
