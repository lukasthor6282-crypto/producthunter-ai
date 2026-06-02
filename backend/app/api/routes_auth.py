from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db import get_db
from app.dependencies.auth import get_current_session
from app.schemas.auth_schema import AuthConfig, AuthSessionResponse, GoogleLoginRequest
from app.services.auth_service import (
    create_user_session,
    revoke_session,
    upsert_google_user,
    verify_google_credential,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_session_cookie(response: Response, raw_token: str, expires_at: datetime) -> None:
    settings = get_settings()
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    max_age = max(0, int((expires_at - datetime.now(timezone.utc)).total_seconds()))
    response.set_cookie(
        key=settings.session_cookie_name,
        value=raw_token,
        max_age=max_age,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        path="/",
    )


def _clear_session_cookie(response: Response) -> None:
    settings = get_settings()
    response.delete_cookie(
        key=settings.session_cookie_name,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        path="/",
    )


def _validate_origin(request: Request) -> None:
    origin = request.headers.get("origin")
    if origin and origin not in get_settings().cors_origins:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Origem nao autorizada.")


def _bearer_token(request: Request) -> str | None:
    authorization = request.headers.get("authorization")
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        return None
    return token.strip()


@router.get("/config", response_model=AuthConfig)
def auth_config() -> AuthConfig:
    settings = get_settings()
    return AuthConfig(
        google_client_id=settings.google_client_id,
        google_auth_enabled=settings.google_auth_enabled,
        session_cookie_secure=settings.session_cookie_secure,
        database_engine=settings.database_engine,
    )


@router.post("/google", response_model=AuthSessionResponse)
def login_with_google(
    payload: GoogleLoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthSessionResponse:
    _validate_origin(request)
    profile = verify_google_credential(payload.credential)
    user = upsert_google_user(db, profile)
    raw_token, session = create_user_session(
        db,
        user,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    _set_session_cookie(response, raw_token, session.expires_at)
    return AuthSessionResponse(user=user, expires_at=session.expires_at, access_token=raw_token)


@router.get("/me", response_model=AuthSessionResponse)
def me(session=Depends(get_current_session)) -> AuthSessionResponse:
    return AuthSessionResponse(user=session.user, expires_at=session.expires_at)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, response: Response, db: Session = Depends(get_db)) -> Response:
    settings = get_settings()
    revoke_session(db, request.cookies.get(settings.session_cookie_name) or _bearer_token(request))
    _clear_session_cookie(response)
    return response
