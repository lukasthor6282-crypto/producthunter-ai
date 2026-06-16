from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.auth import get_current_admin_user
from app.models.auth_models import User
from app.models.recommendation_models import RecommendationRun
from app.schemas.admin_schema import (
    AdminOverviewResponse,
    AdminUserResponse,
    AdminUsersResponse,
    AdminUserUpdate,
)
from app.services.audit_service import safe_record_security_event

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/overview", response_model=AdminOverviewResponse)
def admin_overview(
    _: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> AdminOverviewResponse:
    total_users = db.scalar(select(func.count(User.id))) or 0
    active_users = db.scalar(select(func.count(User.id)).where(User.is_active.is_(True))) or 0
    admin_users = db.scalar(select(func.count(User.id)).where(User.is_admin.is_(True))) or 0
    total_recommendation_runs = db.scalar(select(func.count(RecommendationRun.id))) or 0
    return AdminOverviewResponse(
        total_users=total_users,
        active_users=active_users,
        admin_users=admin_users,
        total_recommendation_runs=total_recommendation_runs,
    )


@router.get("/users", response_model=AdminUsersResponse)
def list_admin_users(
    limit: int = 100,
    _: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> AdminUsersResponse:
    safe_limit = max(1, min(limit, 500))
    users = db.scalars(select(User).order_by(User.created_at.desc(), User.id.desc()).limit(safe_limit)).all()
    return AdminUsersResponse(items=[AdminUserResponse.model_validate(user) for user in users])


@router.patch("/users/{user_id}", response_model=AdminUserResponse)
def update_admin_user(
    user_id: int,
    payload: AdminUserUpdate,
    request: Request,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> AdminUserResponse:
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario nao encontrado.")

    if target.id == current_admin.id and payload.is_admin is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voce nao pode remover o seu proprio acesso de administrador.",
        )
    if target.id == current_admin.id and payload.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voce nao pode desativar a sua propria conta.",
        )

    changes: dict[str, bool] = {}
    if payload.is_active is not None and target.is_active != payload.is_active:
        target.is_active = payload.is_active
        changes["is_active"] = payload.is_active
    if payload.is_admin is not None and target.is_admin != payload.is_admin:
        target.is_admin = payload.is_admin
        changes["is_admin"] = payload.is_admin

    if changes:
        db.commit()
        db.refresh(target)
        safe_record_security_event(
            db,
            "admin.user_update",
            "success",
            user=current_admin,
            request=request,
            details={"target_user_id": target.id, "target_email": target.email, "changes": changes},
        )

    return AdminUserResponse.model_validate(target)
