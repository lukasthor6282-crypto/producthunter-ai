from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from secrets import token_urlsafe

from fastapi import HTTPException, status
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.auth_models import User, UserSession, utcnow


@dataclass(frozen=True)
class GoogleProfile:
    sub: str
    email: str
    email_verified: bool
    name: str | None
    picture_url: str | None
    locale: str | None


def hash_session_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def verify_google_credential(credential: str) -> GoogleProfile:
    settings = get_settings()
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth ainda nao foi configurado no backend.",
        )

    try:
        id_info = google_id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.google_client_id,
            clock_skew_in_seconds=10,
        )
    except (ValueError, GoogleAuthError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token Google invalido.") from exc

    sub = id_info.get("sub")
    email = id_info.get("email")
    email_verified = bool(id_info.get("email_verified"))
    if not sub or not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token Google sem identidade valida.")
    if not email_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="E-mail Google ainda nao verificado.")

    return GoogleProfile(
        sub=str(sub),
        email=str(email).lower(),
        email_verified=email_verified,
        name=id_info.get("name"),
        picture_url=id_info.get("picture"),
        locale=id_info.get("locale"),
    )


def upsert_google_user(db: Session, profile: GoogleProfile) -> User:
    now = utcnow()
    user = db.scalar(select(User).where(User.google_sub == profile.sub))
    if user is None:
        existing_email = db.scalar(select(User).where(User.email == profile.email))
        if existing_email is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ja existe uma conta com este e-mail usando outro identificador Google.",
            )

        user = User(
            google_sub=profile.sub,
            email=profile.email,
            name=profile.name,
            picture_url=profile.picture_url,
            locale=profile.locale,
            email_verified=profile.email_verified,
            last_login_at=now,
        )
        db.add(user)
    else:
        user.email = profile.email
        user.name = profile.name
        user.picture_url = profile.picture_url
        user.locale = profile.locale
        user.email_verified = profile.email_verified
        user.last_login_at = now

    db.commit()
    db.refresh(user)
    return user


def create_user_session(
    db: Session,
    user: User,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> tuple[str, UserSession]:
    settings = get_settings()
    now = utcnow()
    expires_at = now + timedelta(days=settings.session_expire_days)

    cleanup_user_sessions(db, user.id, now)

    raw_token = token_urlsafe(48)
    session = UserSession(
        user_id=user.id,
        token_hash=hash_session_token(raw_token),
        user_agent=user_agent[:512] if user_agent else None,
        ip_address=ip_address,
        expires_at=expires_at,
    )
    db.add(session)
    db.flush()
    enforce_active_session_limit(db, user.id, now)
    db.commit()
    db.refresh(session)
    return raw_token, session


def cleanup_user_sessions(db: Session, user_id: int, now: datetime | None = None) -> None:
    settings = get_settings()
    now = now or utcnow()
    revoked_before = now - timedelta(days=max(0, settings.session_revoked_retention_days))

    db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.expires_at < now,
    ).delete(synchronize_session=False)

    db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.revoked_at.is_not(None),
        UserSession.revoked_at < revoked_before,
    ).delete(synchronize_session=False)


def enforce_active_session_limit(db: Session, user_id: int, now: datetime | None = None) -> None:
    settings = get_settings()
    now = now or utcnow()
    max_active_sessions = max(1, settings.session_max_active_per_user)
    active_sessions = db.scalars(
        select(UserSession)
        .where(
            UserSession.user_id == user_id,
            UserSession.revoked_at.is_(None),
            UserSession.expires_at > now,
        )
        .order_by(UserSession.created_at.desc(), UserSession.id.desc())
    ).all()

    for old_session in active_sessions[max_active_sessions:]:
        old_session.revoked_at = now


def list_active_sessions(db: Session, user: User) -> list[UserSession]:
    now = utcnow()
    return list(
        db.scalars(
            select(UserSession)
            .where(
                UserSession.user_id == user.id,
                UserSession.revoked_at.is_(None),
                UserSession.expires_at > now,
            )
            .order_by(UserSession.last_seen_at.desc(), UserSession.created_at.desc(), UserSession.id.desc())
        ).all()
    )


def revoke_user_session(db: Session, user: User, session_id: int) -> UserSession | None:
    session = db.scalar(
        select(UserSession).where(
            UserSession.id == session_id,
            UserSession.user_id == user.id,
            UserSession.revoked_at.is_(None),
        )
    )
    if session is None:
        return None

    session.revoked_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(session)
    return session


def revoke_other_user_sessions(db: Session, user: User, current_session_id: int) -> int:
    now = datetime.now(timezone.utc)
    sessions = db.scalars(
        select(UserSession).where(
            UserSession.user_id == user.id,
            UserSession.id != current_session_id,
            UserSession.revoked_at.is_(None),
            UserSession.expires_at > now,
        )
    ).all()

    for session in sessions:
        session.revoked_at = now

    db.commit()
    return len(sessions)


def get_valid_session(db: Session, raw_token: str | None) -> UserSession | None:
    if not raw_token:
        return None

    now = utcnow()
    session = db.scalar(
        select(UserSession).where(
            UserSession.token_hash == hash_session_token(raw_token),
            UserSession.revoked_at.is_(None),
            UserSession.expires_at > now,
        )
    )
    if session is None or not session.user.is_active:
        return None

    session.last_seen_at = now
    db.commit()
    db.refresh(session)
    return session


def revoke_session(db: Session, raw_token: str | None) -> UserSession | None:
    if not raw_token:
        return None

    session = db.scalar(
        select(UserSession).where(
            UserSession.token_hash == hash_session_token(raw_token),
            UserSession.revoked_at.is_(None),
        )
    )
    if session is None:
        return None

    session.revoked_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(session)
    return session
