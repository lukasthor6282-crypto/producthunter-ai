from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


class UserProfileORM(Base):
    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    operation_type: Mapped[str] = mapped_column(String(80))
    marketplace: Mapped[str] = mapped_column(String(80))
    niche: Mapped[str] = mapped_column(String(80))
    goal: Mapped[str] = mapped_column(String(120))
    investment_range: Mapped[str] = mapped_column(String(80))
    experience_level: Mapped[str] = mapped_column(String(80))
    traffic_type: Mapped[str] = mapped_column(String(80))

