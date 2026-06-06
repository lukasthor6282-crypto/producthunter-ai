from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.auth import get_current_user
from app.models.auth_models import User
from app.schemas.recommendation_schema import (
    RecommendationHistoryResponse,
    RecommendationRequest,
    RecommendationResponse,
    RecommendationUsageResponse,
)
from app.services.recommendation_history_service import (
    list_recommendation_history,
    recommendation_usage_status,
    save_recommendation_run,
)
from app.services.recommendation_service import generate_recommendations

router = APIRouter(tags=["recommendations"])


@router.post("/recommendations/generate", response_model=RecommendationResponse)
def generate(
    request: RecommendationRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    try:
        response = generate_recommendations(request)
        save_recommendation_run(db, user, request, response)
        return response
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Nao foi possivel gerar recomendacoes agora.",
        ) from exc


@router.get("/recommendations/history", response_model=RecommendationHistoryResponse)
def history(
    limit: int = Query(default=20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecommendationHistoryResponse:
    return list_recommendation_history(db, user, limit=limit)


@router.get("/recommendations/usage", response_model=RecommendationUsageResponse)
def usage(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RecommendationUsageResponse:
    return recommendation_usage_status(db, user)
