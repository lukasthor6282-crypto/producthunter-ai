from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.product_schema import ProductOut
from app.schemas.profile_schema import UserProfile


class RecommendedProduct(ProductOut):
    opportunity_score: float
    estimated_margin: float
    estimated_profit: float
    conversion_probability: float
    competition_level: str
    risk_score: float
    best_for: str
    recommended_strategy: str
    target_audience: str
    recommendation_reason: str
    affiliate_earning: float


class RecommendationRequest(UserProfile):
    limit: int = Field(default=8, ge=1, le=25)


class RecommendationResponse(BaseModel):
    profile: UserProfile
    narrative: str
    recommended_products: list[RecommendedProduct]

