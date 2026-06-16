from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AdminUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str | None = None
    email_verified: bool
    is_active: bool
    is_admin: bool
    created_at: datetime
    last_login_at: datetime | None = None


class AdminUsersResponse(BaseModel):
    items: list[AdminUserResponse]


class AdminUserUpdate(BaseModel):
    is_active: bool | None = None
    is_admin: bool | None = None


class AdminOverviewResponse(BaseModel):
    total_users: int
    active_users: int
    admin_users: int
    total_recommendation_runs: int
