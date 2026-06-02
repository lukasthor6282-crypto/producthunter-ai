from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.profile_schema import UserProfile


class MLPredictRequest(UserProfile):
    product_id: str | None = None
    limit: int = Field(default=5, ge=1, le=20)


class MLPrediction(BaseModel):
    product_id: str
    product_name: str
    conversion_probability: float
    estimated_margin: float
    estimated_profit: float
    opportunity_score: float
    risk_score: float


class MLPredictResponse(BaseModel):
    model_name: str
    predictions: list[MLPrediction]


class MLExplainResponse(BaseModel):
    model_name: str
    feature_groups: dict[str, list[str]]
    simple_explanation: str
    how_to_improve: list[str]


class MLMetricsResponse(BaseModel):
    model_name: str
    trained_rows: int
    metrics: dict[str, float]
    top_features: list[dict[str, float | str]]

