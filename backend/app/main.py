from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    routes_analytics,
    routes_favorites,
    routes_ml,
    routes_products,
    routes_profit,
    routes_recommendations,
)
from app.core.config import settings

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": settings.app_name, "version": settings.app_version}


app.include_router(routes_products.router)
app.include_router(routes_recommendations.router)
app.include_router(routes_profit.router)
app.include_router(routes_ml.router)
app.include_router(routes_analytics.router)
app.include_router(routes_favorites.router)

