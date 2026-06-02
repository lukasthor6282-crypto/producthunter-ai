from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = "ProductHunter AI"
    app_version: str = "0.1.0"
    environment: str = os.getenv("APP_ENV", "development")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./producthunter.db")
    cors_origins: tuple[str, ...] = (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    )


settings = Settings()

