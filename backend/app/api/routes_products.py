from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.data_providers.simulated_provider import SimulatedMarketplaceProvider
from app.schemas.product_schema import ProductCompareRequest, ProductCompareResponse, ProductListResponse, ProductOut
from app.services.scoring_service import enrich_product

router = APIRouter(tags=["products"])
provider = SimulatedMarketplaceProvider()


@router.get("/products", response_model=ProductListResponse)
def list_products(
    marketplace: str | None = None,
    niche: str | None = None,
    limit: int = Query(default=50, ge=1, le=250),
) -> ProductListResponse:
    products = provider.list_products()
    if marketplace:
        products = [product for product in products if product["marketplace"].lower() == marketplace.lower()]
    if niche:
        products = [product for product in products if product["niche"].lower() == niche.lower()]
    return ProductListResponse(total=len(products), products=[ProductOut(**item) for item in products[:limit]])


@router.get("/products/search", response_model=ProductListResponse)
def search_products(query: str = Query(min_length=2), limit: int = Query(default=20, ge=1, le=80)) -> ProductListResponse:
    term = query.lower()
    matches = [
        product
        for product in provider.list_products()
        if term in product["product_name"].lower()
        or term in product["category"].lower()
        or term in product["niche"].lower()
        or term in product["marketplace"].lower()
    ]
    return ProductListResponse(total=len(matches), products=[ProductOut(**item) for item in matches[:limit]])


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: str) -> ProductOut:
    for product in provider.list_products():
        if product["product_id"] == product_id:
            return ProductOut(**product)
    raise HTTPException(status_code=404, detail="Produto nao encontrado")


@router.post("/products/compare", response_model=ProductCompareResponse)
def compare_products(payload: ProductCompareRequest) -> ProductCompareResponse:
    products = [product for product in provider.list_products() if product["product_id"] in payload.product_ids]
    profile = payload.model_dump(exclude={"product_ids"})
    compared = [enrich_product(product, profile) for product in products]
    compared.sort(key=lambda item: item["opportunity_score"], reverse=True)
    winner = compared[0] if compared else None
    summary = (
        f"{winner['product_name']} tem o melhor equilibrio entre score, margem e risco para este perfil."
        if winner
        else "Nenhum produto encontrado para comparar."
    )
    return ProductCompareResponse(winner_product_id=winner["product_id"] if winner else None, summary=summary, products=compared)

