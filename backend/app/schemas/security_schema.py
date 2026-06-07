from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class SecurityAuditEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_type: str
    status: str
    email: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    details: dict[str, Any]
    created_at: datetime


class SecurityAuditEventsResponse(BaseModel):
    items: list[SecurityAuditEventResponse]
