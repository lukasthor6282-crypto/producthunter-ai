from __future__ import annotations

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


class ProductORM(Base):
    __tablename__ = "products"

    product_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    product_name: Mapped[str] = mapped_column(String(220), index=True)
    marketplace: Mapped[str] = mapped_column(String(80), index=True)
    niche: Mapped[str] = mapped_column(String(80), index=True)
    category: Mapped[str] = mapped_column(String(120))
    average_price: Mapped[float] = mapped_column(Float)
    estimated_cost: Mapped[float] = mapped_column(Float)
    competitor_count: Mapped[int] = mapped_column(Integer)
    trend_score: Mapped[float] = mapped_column(Float)

