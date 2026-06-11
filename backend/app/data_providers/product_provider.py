from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from time import monotonic
from typing import Any
from urllib.parse import urlencode
import zlib

import requests

from app.core.config import get_settings
from app.data_providers.simulated_provider import SimulatedProductProvider
from app.schemas.product_schema import Product
from app.utils.constants import MARKETPLACES, NICHES


DUMMYJSON_URL = "https://dummyjson.com/products"
MERCADO_LIVRE_SEARCH_URL = "https://api.mercadolibre.com/sites/MLB/search"
BRL_PER_USD = 5.2
MIN_PRODUCTS_PER_SEGMENT = 4
CATALOG_REQUEST_TIMEOUT_SECONDS = 2.5
MERCADO_LIVRE_REQUEST_TIMEOUT_SECONDS = 2.0
MERCADO_LIVRE_MAX_QUERIES = 6

MARKETPLACE_BY_INDEX = [marketplace["value"] for marketplace in MARKETPLACES]
MARKETPLACE_LABELS = {marketplace["value"]: marketplace["label"] for marketplace in MARKETPLACES}
NICHE_LABELS = {niche["value"]: niche["label"] for niche in NICHES}

DUMMY_CATEGORY_TO_NICHE = {
    "beauty": "beauty",
    "fragrances": "beauty",
    "skin-care": "beauty",
    "furniture": "home",
    "groceries": "kitchen",
    "home-decoration": "decoration",
    "kitchen-accessories": "kitchen",
    "laptops": "technology",
    "mens-shirts": "fashion",
    "mens-shoes": "fashion",
    "mens-watches": "fashion",
    "mobile-accessories": "technology",
    "motorcycle": "automotive",
    "smartphones": "technology",
    "sports-accessories": "sports",
    "sunglasses": "fashion",
    "tablets": "technology",
    "tops": "fashion",
    "vehicle": "automotive",
    "womens-bags": "fashion",
    "womens-dresses": "fashion",
    "womens-jewellery": "fashion",
    "womens-shoes": "fashion",
    "womens-watches": "fashion",
}

NICHE_SEARCH_QUERIES = {
    "technology": ["smartwatch", "fone bluetooth", "carregador turbo"],
    "beauty": ["escova secadora", "skincare", "massageador facial"],
    "home": ["organizador casa", "aspirador portatil", "luminaria"],
    "toys": ["brinquedo educativo", "lego", "montessori"],
    "pets": ["bebedouro pet", "cama pet", "coleira led"],
    "fashion": ["bolsa feminina", "relogio masculino", "tenis feminino"],
    "tools": ["parafusadeira", "kit ferramentas", "trena laser"],
    "automotive": ["suporte veicular", "camera de re", "aspirador automotivo"],
    "decoration": ["luminaria led", "vaso decorativo", "quadro decorativo"],
    "health": ["umidificador", "balanca digital", "massageador cervical"],
    "sports": ["garrafa termica", "corda speed", "luva treino"],
    "games": ["mouse gamer", "headset gamer", "controle mobile"],
    "stationery": ["planner", "caneta gel", "organizador mesa"],
    "kitchen": ["cortador legumes", "pote hermetico", "garrafa inox"],
    "organization": ["caixa organizadora", "divisor gaveta", "cabide multifuncional"],
}

CATEGORY_LABELS = {
    "beauty": "Beleza",
    "fragrances": "Perfumaria",
    "furniture": "Moveis",
    "groceries": "Mercado",
    "home-decoration": "Decoracao",
    "kitchen-accessories": "Cozinha",
    "laptops": "Notebooks",
    "mens-shirts": "Camisas masculinas",
    "mens-shoes": "Calcados masculinos",
    "mens-watches": "Relogios masculinos",
    "mobile-accessories": "Acessorios mobile",
    "motorcycle": "Motocicletas",
    "skin-care": "Skincare",
    "smartphones": "Smartphones",
    "sports-accessories": "Acessorios esportivos",
    "sunglasses": "Oculos",
    "tablets": "Tablets",
    "tops": "Blusas",
    "vehicle": "Automotivo",
    "womens-bags": "Bolsas femininas",
    "womens-dresses": "Vestidos",
    "womens-jewellery": "Joias",
    "womens-shoes": "Calcados femininos",
    "womens-watches": "Relogios femininos",
}


@dataclass
class CachedProducts:
    expires_at: float
    products: list[Product]


class HybridProductProvider:
    def __init__(self) -> None:
        self._settings = get_settings()
        self._fallback = SimulatedProductProvider()
        self._cache: CachedProducts | None = None

    def list_products(self) -> list[Product]:
        now = monotonic()
        if self._cache and self._cache.expires_at > now:
            return self._cache.products

        products = self._fetch_products()
        self._cache = CachedProducts(
            expires_at=now + max(60, self._settings.product_catalog_ttl_seconds),
            products=products,
        )
        return products

    def get_product(self, product_id: int) -> Product | None:
        return next((product for product in self.list_products() if product.id == product_id), None)

    def _fetch_products(self) -> list[Product]:
        source = self._settings.product_source

        if source in {"auto", "dummyjson", "catalog"}:
            catalog_products = self._fetch_dummyjson_products()
            if catalog_products:
                return self._ensure_catalog_coverage(catalog_products)

        if source == "mercado_livre":
            mercado_livre_products = self._fetch_mercado_livre_products()
            if mercado_livre_products:
                return self._ensure_catalog_coverage(mercado_livre_products)

            # If Mercado Livre is unavailable, keep the API responsive with the
            # lightweight catalog before falling back to simulated coverage.
            catalog_products = self._fetch_dummyjson_products()
            if catalog_products:
                return self._ensure_catalog_coverage(catalog_products)

        return self._fallback_products()

    def _fetch_mercado_livre_products(self) -> list[Product]:
        token = self._settings.mercado_livre_access_token
        if not token:
            return []

        products: list[Product] = []
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "User-Agent": "ProductHunterAI/1.0",
        }
        attempted_queries = 0

        for niche, queries in NICHE_SEARCH_QUERIES.items():
            for query in queries[:2]:
                if attempted_queries >= MERCADO_LIVRE_MAX_QUERIES:
                    return _dedupe_products(products)
                attempted_queries += 1
                try:
                    response = requests.get(
                        MERCADO_LIVRE_SEARCH_URL,
                        params={"q": query, "limit": 8},
                        headers=headers,
                        timeout=MERCADO_LIVRE_REQUEST_TIMEOUT_SECONDS,
                    )
                    response.raise_for_status()
                except requests.RequestException:
                    continue

                for item in response.json().get("results", []):
                    product = _mercado_livre_to_product(item, niche)
                    if product:
                        products.append(product)

        return _dedupe_products(products)

    def _fetch_dummyjson_products(self) -> list[Product]:
        try:
            response = requests.get(
                f"{DUMMYJSON_URL}?{urlencode({'limit': 194})}",
                timeout=CATALOG_REQUEST_TIMEOUT_SECONDS,
            )
            response.raise_for_status()
        except requests.RequestException:
            return []

        products = [
            _dummyjson_to_product(item, index)
            for index, item in enumerate(response.json().get("products", []), start=1)
        ]
        return [product for product in products if product is not None]

    def _fallback_products(self) -> list[Product]:
        return [
            product.model_copy(
                update={
                    "id": _stable_product_id(f"simulated_fallback:{product.id}"),
                    "source": "simulated_fallback",
                    "source_product_id": f"simulated_fallback:{product.id}",
                    "image_url": _placeholder_image_url(product.name),
                }
            )
            for product in self._fallback.list_products()
        ]

    def _ensure_catalog_coverage(self, products: list[Product]) -> list[Product]:
        counts: dict[tuple[str, str], int] = {}
        for product in products:
            key = (product.niche, product.marketplace)
            counts[key] = counts.get(key, 0) + 1

        covered_products = list(products)
        existing_ids = {product.id for product in covered_products}
        for product in self._fallback_products():
            key = (product.niche, product.marketplace)
            if counts.get(key, 0) >= MIN_PRODUCTS_PER_SEGMENT:
                continue
            if product.id in existing_ids:
                continue
            covered_products.append(product)
            existing_ids.add(product.id)
            counts[key] = counts.get(key, 0) + 1

        return _dedupe_products(covered_products)


@lru_cache(maxsize=1)
def get_provider() -> HybridProductProvider:
    return HybridProductProvider()


def _dummyjson_to_product(item: dict[str, Any], index: int) -> Product | None:
    try:
        source_id = f"dummyjson:{item['id']}"
        category = str(item.get("category") or "general")
        niche = DUMMY_CATEGORY_TO_NICHE.get(category, "technology")
        marketplace = MARKETPLACE_BY_INDEX[index % len(MARKETPLACE_BY_INDEX)]
        price = float(item["price"]) * BRL_PER_USD
        discount = float(item.get("discountPercentage") or 0)
        rating = float(item.get("rating") or 4)
        stock = int(item.get("stock") or 1)
        reviews = item.get("reviews") or []
        weight = max(0.08, float(item.get("weight") or 1) * 0.18)
        image_url = item.get("thumbnail") or next(iter(item.get("images") or []), None)
        return Product(
            id=_stable_product_id(source_id),
            name=str(item["title"]),
            marketplace=marketplace,
            marketplace_label=MARKETPLACE_LABELS[marketplace],
            niche=niche,
            niche_label=NICHE_LABELS[niche],
            category=CATEGORY_LABELS.get(category, category.replace("-", " ").title()),
            image_url=image_url,
            product_url=f"{DUMMYJSON_URL}/{item['id']}",
            source="dummyjson",
            source_product_id=source_id,
            average_price=round(price, 2),
            min_price=round(price * max(0.58, 1 - (discount / 100)), 2),
            max_price=round(price * 1.22, 2),
            estimated_cost=round(price * 0.48, 2),
            platform_fee_percent=_marketplace_fee(marketplace),
            estimated_shipping=round(9 + min(28, weight * 6), 2),
            packaging_cost=round(2.4 + min(8, weight * 1.8), 2),
            estimated_tax_percent=0.065,
            affiliate_commission_percent=round(0.045 + min(0.13, discount / 360), 4),
            competitors_count=max(12, int(220 - stock + index % 80)),
            search_volume=max(800, int(1200 + stock * 180 + rating * 900)),
            trend_score=round(_clamp(45 + rating * 9 + discount * 0.65 + min(stock, 80) * 0.12, 10, 98), 2),
            average_rating=round(_clamp(rating, 0, 5), 2),
            reviews_count=max(len(reviews), 1) * 120 + stock * 3,
            sales_velocity=round(_clamp(38 + stock * 0.35 + rating * 7, 8, 96), 2),
            return_risk=round(_clamp(45 - rating * 4 + weight * 2.2, 5, 88), 2),
            seasonality=round(_clamp(30 + (index % 9) * 6, 5, 92), 2),
            product_weight_kg=round(weight, 2),
            delivery_days=2 + (index % 7),
            supplier_reliability=round(_clamp(62 + rating * 7 + min(stock, 50) * 0.18, 35, 99), 2),
            visual_appeal=86 if image_url else 58,
            kit_potential=round(_clamp(35 + min(stock, 60) * 0.42 + (index % 5) * 4, 5, 96), 2),
            recurrence_score=round(_recurrence_for_niche(niche, category), 2),
            created_for_demo=False,
        )
    except (KeyError, TypeError, ValueError):
        return None


def _mercado_livre_to_product(item: dict[str, Any], niche: str) -> Product | None:
    try:
        source_id = f"mercado_livre:{item['id']}"
        price = float(item["price"])
        original_price = item.get("original_price")
        discount = 0.0
        if original_price and float(original_price) > price:
            discount = ((float(original_price) - price) / float(original_price)) * 100

        rating = float(item.get("reviews", {}).get("rating_average") or item.get("rating_average") or 4.2)
        reviews_count = int(item.get("reviews", {}).get("total") or item.get("reviews_count") or 80)
        sold_quantity = int(item.get("sold_quantity") or item.get("order_backend") or 20)
        image_url = _https_url(item.get("thumbnail") or item.get("secure_thumbnail"))
        shipping = item.get("shipping") or {}
        return Product(
            id=_stable_product_id(source_id),
            name=str(item["title"]),
            marketplace="mercado_livre",
            marketplace_label="Mercado Livre",
            niche=niche,
            niche_label=NICHE_LABELS[niche],
            category=str(item.get("category_id") or "Mercado Livre"),
            image_url=image_url,
            product_url=item.get("permalink"),
            source="mercado_livre",
            source_product_id=source_id,
            average_price=round(price, 2),
            min_price=round(price * max(0.65, 1 - discount / 100), 2),
            max_price=round(price * 1.18, 2),
            estimated_cost=round(price * 0.52, 2),
            platform_fee_percent=0.14,
            estimated_shipping=0 if shipping.get("free_shipping") else 18,
            packaging_cost=4.2,
            estimated_tax_percent=0.065,
            affiliate_commission_percent=round(0.055 + min(0.11, discount / 380), 4),
            competitors_count=max(20, 180 - min(sold_quantity, 90)),
            search_volume=max(900, 1600 + sold_quantity * 220 + reviews_count * 12),
            trend_score=round(_clamp(50 + min(sold_quantity, 160) * 0.22 + rating * 7 + discount * 0.45, 10, 98), 2),
            average_rating=round(_clamp(rating, 0, 5), 2),
            reviews_count=max(0, reviews_count),
            sales_velocity=round(_clamp(38 + min(sold_quantity, 180) * 0.32 + rating * 5, 8, 98), 2),
            return_risk=round(_clamp(42 - rating * 4, 5, 88), 2),
            seasonality=42,
            product_weight_kg=0.65,
            delivery_days=3 if shipping.get("logistic_type") == "fulfillment" else 5,
            supplier_reliability=round(_clamp(66 + rating * 6, 35, 99), 2),
            visual_appeal=88 if image_url else 55,
            kit_potential=55,
            recurrence_score=_recurrence_for_niche(niche, ""),
            created_for_demo=False,
        )
    except (KeyError, TypeError, ValueError):
        return None


def _marketplace_fee(marketplace: str) -> float:
    return {
        "mercado_livre": 0.14,
        "amazon": 0.15,
        "shopee": 0.13,
        "aliexpress": 0.11,
        "tiktok_shop": 0.10,
        "magalu": 0.16,
        "shein": 0.12,
    }.get(marketplace, 0.13)


def _recurrence_for_niche(niche: str, category: str) -> float:
    if niche in {"beauty", "pets", "stationery", "kitchen"}:
        return 72
    if category in {"groceries", "skin-care", "fragrances"}:
        return 78
    if niche in {"technology", "games", "automotive"}:
        return 42
    return 54


def _dedupe_products(products: list[Product]) -> list[Product]:
    seen: set[str] = set()
    unique: list[Product] = []
    for product in products:
        key = product.source_product_id or f"{product.source}:{product.name}"
        if key in seen:
            continue
        seen.add(key)
        unique.append(product)
    return unique


def _placeholder_image_url(name: str) -> str:
    safe_name = name.replace(" ", "+")[:38]
    return f"https://dummyjson.com/image/500x500/111827/f8fafc?text={safe_name}"


def _stable_product_id(value: str) -> int:
    return zlib.crc32(value.encode("utf-8")) & 0x7FFFFFFF


def _https_url(value: str | None) -> str | None:
    if not value:
        return None
    if value.startswith("http://"):
        return value.replace("http://", "https://", 1)
    return value


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))
