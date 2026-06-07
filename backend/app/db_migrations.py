from __future__ import annotations

import logging
from pathlib import Path

from sqlalchemy import inspect

from app.db import engine, init_db

logger = logging.getLogger(__name__)


def _backend_dir() -> Path:
    return Path(__file__).resolve().parents[1]


def _alembic_config():
    from alembic.config import Config

    backend_dir = _backend_dir()
    config = Config(str(backend_dir / "alembic.ini"))
    config.set_main_option("script_location", str(backend_dir / "migrations"))
    return config


def _has_existing_application_tables(table_names: set[str]) -> bool:
    application_tables = {
        "users",
        "user_sessions",
        "billing_subscriptions",
        "recommendation_runs",
        "recommendation_run_items",
        "recommendation_usage",
    }
    return bool(application_tables.intersection(table_names))


def run_startup_migrations() -> None:
    try:
        from alembic import command
    except ImportError:
        logger.warning("Alembic is not installed; falling back to SQLAlchemy create_all.")
        init_db()
        return

    config = _alembic_config()
    table_names = set(inspect(engine).get_table_names())
    has_alembic_version = "alembic_version" in table_names

    if not has_alembic_version and _has_existing_application_tables(table_names):
        logger.info("Existing database detected without Alembic version; stamping current schema.")
        init_db()
        with engine.begin() as connection:
            config.attributes["connection"] = connection
            command.stamp(config, "head")
        return

    with engine.begin() as connection:
        config.attributes["connection"] = connection
        command.upgrade(config, "head")
