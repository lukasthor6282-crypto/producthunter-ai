from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


class RecommendationORM(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[str] = mapped_column(String(120), ForeignKey("products.product_id"))
    profile_id: Mapped[int] = mapped_column(Integer, ForeignKey("user_profiles.id"))
    opportunity_score: Mapped[float] = mapped_column(Float)
    risk_score: Mapped[float] = mapped_column(Float)

