from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.data_providers.simulated_provider import SimulatedMarketplaceProvider

router = APIRouter(tags=["favorites"])
provider = SimulatedMarketplaceProvider()
favorites: list[str] = []


class FavoriteRequest(BaseModel):
    product_id: str


@router.post("/favorites")
def add_favorite(payload: FavoriteRequest) -> dict[str, str]:
    if not any(product["product_id"] == payload.product_id for product in provider.list_products()):
        raise HTTPException(status_code=404, detail="Produto nao encontrado")
    if payload.product_id not in favorites:
        favorites.append(payload.product_id)
    return {"status": "saved", "product_id": payload.product_id}


@router.get("/favorites")
def list_favorites() -> dict[str, list[dict]]:
    products = [product for product in provider.list_products() if product["product_id"] in favorites]
    return {"products": products}

