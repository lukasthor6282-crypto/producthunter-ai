from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import InMemoryRateLimiter, require_trusted_origin
from app.db import get_db
from app.dependencies.auth import get_current_session
from app.schemas.security_schema import (
    RevokeSecuritySessionResponse,
    SecurityAuditEventsResponse,
    SecuritySessionResponse,
    SecuritySessionsResponse,
)
from app.schemas.auth_schema import AuthConfig, AuthSessionResponse, GoogleLoginRequest
from app.services.audit_service import list_user_security_events, safe_record_security_event
from app.services.auth_service import (
    create_user_session,
    list_active_sessions,
    revoke_other_user_sessions,
    revoke_session,
    revoke_user_session,
    upsert_google_user,
    verify_google_credential,
)

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()
google_login_rate_limit = InMemoryRateLimiter(
    scope="auth_google",
    limit=settings.auth_rate_limit_count,
    window_seconds=settings.auth_rate_limit_window_seconds,
)


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
    require_trusted_origin(request)


def _bearer_token(request: Request) -> str | None:
    authorization = request.headers.get("authorization")
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        return None
    return token.strip()


def _audit_auth_exception(db: Session, request: Request, exc: HTTPException) -> None:
    safe_record_security_event(
        db,
        "auth.login",
        "blocked" if exc.status_code == status.HTTP_403_FORBIDDEN else "failure",
        request=request,
        details={
            "provider": "google",
            "status_code": exc.status_code,
            "reason": str(exc.detail),
        },
    )


def _security_session_response(session, current_session_id: int) -> SecuritySessionResponse:
    return SecuritySessionResponse(
        id=session.id,
        ip_address=session.ip_address,
        user_agent=session.user_agent,
        created_at=session.created_at,
        last_seen_at=session.last_seen_at,
        expires_at=session.expires_at,
        is_current=session.id == current_session_id,
    )


@router.get("/config", response_model=AuthConfig)
def auth_config() -> AuthConfig:
    settings = get_settings()
    return AuthConfig(
        google_client_id=settings.google_client_id,
        google_auth_enabled=settings.google_auth_enabled,
        session_cookie_secure=settings.session_cookie_secure,
        database_engine=settings.database_engine,
    )


@router.post("/google", response_model=AuthSessionResponse, dependencies=[Depends(google_login_rate_limit)])
def login_with_google(
    payload: GoogleLoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthSessionResponse:
    try:
        _validate_origin(request)
        profile = verify_google_credential(payload.credential)
        user = upsert_google_user(db, profile)
    except HTTPException as exc:
        _audit_auth_exception(db, request, exc)
        raise

    raw_token, session = create_user_session(
        db,
        user,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    safe_record_security_event(
        db,
        "auth.login",
        "success",
        user=user,
        request=request,
        details={"provider": "google", "session_id": session.id},
    )
    _set_session_cookie(response, raw_token, session.expires_at)
    return AuthSessionResponse(user=user, expires_at=session.expires_at, access_token=raw_token)


@router.get("/me", response_model=AuthSessionResponse)
def me(session=Depends(get_current_session)) -> AuthSessionResponse:
    return AuthSessionResponse(user=session.user, expires_at=session.expires_at)


@router.get("/security-events", response_model=SecurityAuditEventsResponse)
def security_events(
    limit: int = Query(default=30, ge=1, le=100),
    session=Depends(get_current_session),
    db: Session = Depends(get_db),
) -> SecurityAuditEventsResponse:
    return SecurityAuditEventsResponse(items=list_user_security_events(db, session.user, limit=limit))


@router.get("/sessions", response_model=SecuritySessionsResponse)
def active_sessions(
    session=Depends(get_current_session),
    db: Session = Depends(get_db),
) -> SecuritySessionsResponse:
    sessions = list_active_sessions(db, session.user)
    return SecuritySessionsResponse(
        items=[_security_session_response(item, session.id) for item in sessions],
    )


@router.delete("/sessions", response_model=RevokeSecuritySessionResponse)
def revoke_other_sessions(
    request: Request,
    session=Depends(get_current_session),
    db: Session = Depends(get_db),
) -> RevokeSecuritySessionResponse:
    require_trusted_origin(request)
    revoked_count = revoke_other_user_sessions(db, session.user, session.id)
    safe_record_security_event(
        db,
        "auth.sessions_revoked",
        "success",
        user=session.user,
        request=request,
        details={"scope": "other_sessions", "revoked_count": revoked_count, "session_id": session.id},
    )
    return RevokeSecuritySessionResponse(revoked_count=revoked_count)


@router.delete("/sessions/{session_id}", response_model=RevokeSecuritySessionResponse)
def revoke_active_session(
    session_id: int,
    request: Request,
    session=Depends(get_current_session),
    db: Session = Depends(get_db),
) -> RevokeSecuritySessionResponse:
    require_trusted_origin(request)
    if session_id == session.id:
        safe_record_security_event(
            db,
            "auth.session_revoke",
            "blocked",
            user=session.user,
            request=request,
            details={"reason": "current_session", "session_id": session_id},
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Use sair da conta para encerrar a sessao atual.",
        )

    revoked_session = revoke_user_session(db, session.user, session_id)
    if revoked_session is None:
        safe_record_security_event(
            db,
            "auth.session_revoke",
            "failure",
            user=session.user,
            request=request,
            details={"reason": "session_not_found", "session_id": session_id},
        )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sessao nao encontrada.")

    safe_record_security_event(
        db,
        "auth.session_revoke",
        "success",
        user=session.user,
        request=request,
        details={"session_id": revoked_session.id},
    )
    return RevokeSecuritySessionResponse(revoked_count=1)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, response: Response, db: Session = Depends(get_db)) -> Response:
    settings = get_settings()
    require_trusted_origin(request)
    revoked_session = revoke_session(db, _bearer_token(request) or request.cookies.get(settings.session_cookie_name))
    safe_record_security_event(
        db,
        "auth.logout",
        "success" if revoked_session else "missing_session",
        user_id=revoked_session.user_id if revoked_session else None,
        request=request,
        details={"session_id": revoked_session.id} if revoked_session else {},
    )
    _clear_session_cookie(response)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response
