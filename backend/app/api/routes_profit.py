from __future__ import annotations

from fastapi import APIRouter

from app.schemas.profit_schema import ProfitSimulationRequest, ProfitSimulationResponse
from app.services.profit_service import simulate_profit

router = APIRouter(tags=["profit"])


@router.post("/profit/simulate", response_model=ProfitSimulationResponse)
def simulate(payload: ProfitSimulationRequest) -> ProfitSimulationResponse:
    return simulate_profit(payload)

