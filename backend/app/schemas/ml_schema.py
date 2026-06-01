from pydantic import BaseModel, Field

from app.schemas.profile_schema import UserProfile


class MLPredictionRequest(BaseModel):
    profile: UserProfile
    product_id: int | None = None


class MLPredictionResponse(BaseModel):
    product_id: int
    product_name: str
    conversion_probability: float
    estimated_margin: float
    estimated_profit: float
    opportunity_score: float
    risk_score: float
    model_type: str
    interpretation: str
    top_features: list[str] = Field(default_factory=list)
    metrics: dict[str, dict[str, float]] = Field(default_factory=dict)
