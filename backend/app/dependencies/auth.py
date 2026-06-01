from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db import get_db
from app.models.auth_models import User, UserSession
from app.services.auth_service import get_valid_session


def get_current_session(request: Request, db: Session = Depends(get_db)) -> UserSession:
    settings = get_settings()
    raw_token = request.cookies.get(settings.session_cookie_name)
    session = get_valid_session(db, raw_token)
    if session is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login necessario.")
    return session


def get_current_user(session: UserSession = Depends(get_current_session)) -> User:
    return session.user
