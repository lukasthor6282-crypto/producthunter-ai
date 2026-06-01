from fastapi import APIRouter, Depends, HTTPException

from app.data_providers.simulated_provider import get_provider
from app.dependencies.auth import get_current_user
from app.models.auth_models import User
from app.schemas.profit_schema import ProfitSimulationRequest, ProfitSimulationResponse
from app.services.profit_service import simulate_profit

router = APIRouter(tags=["profit"])


@router.post("/profit/simulate", response_model=ProfitSimulationResponse)
def simulate(
    request: ProfitSimulationRequest,
    _: User = Depends(get_current_user),
) -> ProfitSimulationResponse:
    try:
        product = None
        if request.product_id is not None:
            product = get_provider().get_product(request.product_id)
            if product is None:
                raise HTTPException(status_code=404, detail="Produto nao encontrado")
        return simulate_profit(request, product)
    except HTTPException:
        raise
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Nao foi possivel simular o lucro.") from exc
