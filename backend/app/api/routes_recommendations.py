from __future__ import annotations

from fastapi import APIRouter

from app.data_providers.simulated_provider import SimulatedMarketplaceProvider
from app.schemas.profile_schema import ProfileAnalysisResponse, UserProfile
from app.schemas.recommendation_schema import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import analyze_profile, generate_recommendations

router = APIRouter(tags=["recommendations"])
provider = SimulatedMarketplaceProvider()


@router.post("/recommendations/profile", response_model=ProfileAnalysisResponse)
def profile_analysis(profile: UserProfile) -> ProfileAnalysisResponse:
    analysis = analyze_profile(provider.list_products(), profile.model_dump())
    return ProfileAnalysisResponse(**analysis)


@router.post("/recommendations/generate", response_model=RecommendationResponse)
def generate(payload: RecommendationRequest) -> RecommendationResponse:
    result = generate_recommendations(provider.list_products(), payload.model_dump(exclude={"limit"}), payload.limit)
    return RecommendationResponse(**result)

