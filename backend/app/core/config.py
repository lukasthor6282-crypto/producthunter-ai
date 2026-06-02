from functools import lru_cache
from os import getenv
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel


def _env_bool(name: str, default: bool = False) -> bool:
    value = getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _normalize_database_url(url: str) -> str:
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


class Settings(BaseModel):
    database_url: str
    google_client_id: str | None = None
    app_public_url: str = "http://localhost:5173"
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    stripe_price_starter: str | None = None
    stripe_price_pro: str | None = None
    stripe_price_scale: str | None = None
    session_cookie_name: str = "producthunter_session"
    session_cookie_secure: bool = False
    session_cookie_samesite: str = "lax"
    session_expire_days: int = 30
    cors_origins: list[str]

    @property
    def google_auth_enabled(self) -> bool:
        return bool(self.google_client_id)

    @property
    def database_engine(self) -> str:
        return self.database_url.split(":", 1)[0]


@lru_cache
def get_settings() -> Settings:
    backend_dir = Path(__file__).resolve().parents[2]
    project_dir = backend_dir.parent
    load_dotenv(project_dir / ".env")
    load_dotenv(backend_dir / ".env", override=True)

    app_public_url = getenv("APP_PUBLIC_URL", "http://localhost:5173").rstrip("/")
    default_sqlite = f"sqlite:///{(backend_dir / 'producthunter.db').as_posix()}"
    raw_cors_origins = getenv("CORS_ORIGINS")
    default_cors_origins = f"http://localhost:5173,http://127.0.0.1:5173,{app_public_url}"
    cors_origins = list(
        dict.fromkeys(
            origin.strip()
            for origin in (raw_cors_origins or default_cors_origins).split(",")
            if origin.strip()
        )
    )

    session_cookie_secure = _env_bool("SESSION_COOKIE_SECURE", default=app_public_url.startswith("https://"))
    session_cookie_samesite = getenv(
        "SESSION_COOKIE_SAMESITE",
        "none" if session_cookie_secure else "lax",
    ).lower()

    return Settings(
        database_url=_normalize_database_url(getenv("DATABASE_URL", default_sqlite)),
        google_client_id=getenv("GOOGLE_CLIENT_ID") or None,
        app_public_url=app_public_url,
        stripe_secret_key=getenv("STRIPE_SECRET_KEY") or None,
        stripe_webhook_secret=getenv("STRIPE_WEBHOOK_SECRET") or None,
        stripe_price_starter=getenv("STRIPE_PRICE_STARTER") or None,
        stripe_price_pro=getenv("STRIPE_PRICE_PRO") or None,
        stripe_price_scale=getenv("STRIPE_PRICE_SCALE") or None,
        session_cookie_name=getenv("SESSION_COOKIE_NAME", "producthunter_session"),
        session_cookie_secure=session_cookie_secure,
        session_cookie_samesite=session_cookie_samesite,
        session_expire_days=int(getenv("SESSION_EXPIRE_DAYS", "30")),
        cors_origins=cors_origins,
    )
