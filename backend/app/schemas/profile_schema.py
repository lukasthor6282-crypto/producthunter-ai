from __future__ import annotations

from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    operation_type: str = Field(default="Vendedor")
    marketplace: str = Field(default="Shopee")
    niche: str = Field(default="Tecnologia")
    goal: str = Field(default="Maior lucro")
    investment_range: str = Field(default="R$ 500 a R$ 2.000")
    experience_level: str = Field(default="Iniciante")
    traffic_type: str = Field(default="Marketplace")


class ProfileAnalysisResponse(BaseModel):
    normalized_profile: UserProfile
    scoring_weights: dict[str, float]
    matching_products: int
    notes: list[str]

