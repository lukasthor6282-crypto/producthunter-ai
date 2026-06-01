from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.models.auth_models import User
from app.services.analytics_service import get_dashboard_analytics

router = APIRouter(tags=["analytics"])


@router.get("/analytics/dashboard")
def dashboard(_: User = Depends(get_current_user)) -> dict:
    return get_dashboard_analytics()
