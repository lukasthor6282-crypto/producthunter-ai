from __future__ import annotations

import logging
from typing import Any

from fastapi import Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import client_ip
from app.models.auth_models import User
from app.models.security_models import SecurityAuditEvent

logger = logging.getLogger(__name__)


def record_security_event(
    db: Session,
    event_type: str,
    status: str,
    *,
    user: User | None = None,
    user_id: int | None = None,
    email: str | None = None,
    request: Request | None = None,
    details: dict[str, Any] | None = None,
    commit: bool = True,
) -> SecurityAuditEvent:
    event = SecurityAuditEvent(
        user_id=user.id if user else user_id,
        event_type=event_type,
        status=status,
        email=(user.email if user else email),
        ip_address=client_ip(request) if request else None,
        user_agent=(request.headers.get("user-agent")[:512] if request and request.headers.get("user-agent") else None),
        details=details or {},
    )
    db.add(event)
    if commit:
        db.commit()
        db.refresh(event)
    return event


def safe_record_security_event(
    db: Session,
    event_type: str,
    status: str,
    **kwargs: Any,
) -> None:
    try:
        record_security_event(db, event_type, status, **kwargs)
    except Exception:
        db.rollback()
        logger.exception("Failed to record security audit event.")


def list_user_security_events(db: Session, user: User, limit: int = 30) -> list[SecurityAuditEvent]:
    return list(
        db.scalars(
            select(SecurityAuditEvent)
            .where(SecurityAuditEvent.user_id == user.id)
            .order_by(SecurityAuditEvent.created_at.desc())
            .limit(limit)
        ).all()
    )
