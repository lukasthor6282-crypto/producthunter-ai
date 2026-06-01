from fastapi import APIRouter, HTTPException, Query

from app.data_providers.simulated_provider import get_provider
from app.schemas.product_schema import Product
from app.utils.constants import MARKETPLACE_ALIASES, NICHE_ALIASES
from app.utils.normalization import normalize_alias

router = APIRouter(tags=["products"])


@router.get("/products", response_model=list[Product])
def list_products(limit: int = Query(default=50, ge=1, le=500)) -> list[Product]:
    return get_provider().list_products()[:limit]


@router.get("/products/search", response_model=list[Product])
def search_products(
    marketplace: str | None = None,
    niche: str | None = None,
    query: str | None = None,
    limit: int = Query(default=30, ge=1, le=100),
) -> list[Product]:
    products = get_provider().list_products()
    marketplace_slug = normalize_alias(marketplace, MARKETPLACE_ALIASES) if marketplace else None
    niche_slug = normalize_alias(niche, NICHE_ALIASES) if niche else None
    query_lower = query.lower().strip() if query else None

    filtered = []
    for product in products:
        if marketplace_slug and product.marketplace != marketplace_slug:
            continue
        if niche_slug and product.niche != niche_slug:
            continue
        if query_lower and query_lower not in product.name.lower() and query_lower not in product.category.lower():
            continue
        filtered.append(product)

    return filtered[:limit]


@router.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int) -> Product:
    product = get_provider().get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Produto nao encontrado")
    return product
