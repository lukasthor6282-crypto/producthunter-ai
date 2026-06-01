from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import get_current_user
from app.models.auth_models import User
from app.schemas.recommendation_schema import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import generate_recommendations

router = APIRouter(tags=["recommendations"])


@router.post("/recommendations/generate", response_model=RecommendationResponse)
def generate(
    request: RecommendationRequest,
    _: User = Depends(get_current_user),
) -> RecommendationResponse:
    try:
        return generate_recommendations(request)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Nao foi possivel gerar recomendacoes agora.",
        ) from exc
