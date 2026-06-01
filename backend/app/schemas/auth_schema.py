from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AuthUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str | None = None
    picture_url: str | None = None
    email_verified: bool
    created_at: datetime
    last_login_at: datetime | None = None


class AuthConfig(BaseModel):
    google_client_id: str | None
    google_auth_enabled: bool
    session_cookie_secure: bool
    database_engine: str


class GoogleLoginRequest(BaseModel):
    credential: str = Field(min_length=20)


class AuthSessionResponse(BaseModel):
    user: AuthUser
    expires_at: datetime
