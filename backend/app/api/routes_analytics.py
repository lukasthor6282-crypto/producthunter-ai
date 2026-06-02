from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.data_providers.simulated_provider import SimulatedMarketplaceProvider
from app.services.analytics_service import dashboard_summary

router = APIRouter(tags=["analytics"])
provider = SimulatedMarketplaceProvider()


@router.get("/analytics/dashboard")
def dashboard() -> dict[str, Any]:
    return dashboard_summary(provider.list_products())

