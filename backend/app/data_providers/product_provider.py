from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from functools import lru_cache
import re
from time import monotonic
from typing import Any
import unicodedata
from urllib.parse import urlencode
import zlib

import requests

from app.core.config import get_settings
from app.data_providers.simulated_provider import SimulatedProductProvider
from app.schemas.product_schema import Product
from app.utils.constants import MARKETPLACES, NICHES


DUMMYJSON_URL = "https://dummyjson.com/products"
SERPAPI_SEARCH_URL = "https://serpapi.com/search.json"
MERCADO_LIVRE_SEARCH_URL = "https://api.mercadolibre.com/sites/MLB/search"
BRL_PER_USD = 5.2
MIN_PRODUCTS_PER_SEGMENT = 4
CATALOG_REQUEST_TIMEOUT_SECONDS = 2.5
GOOGLE_SHOPPING_REQUEST_TIMEOUT_SECONDS = 4.0
GOOGLE_SHOPPING_RESULTS_PER_QUERY = 8
GOOGLE_IMAGES_REQUEST_TIMEOUT_SECONDS = 4.0
GOOGLE_IMAGES_RESULTS_PER_QUERY = 10
MERCADO_LIVRE_REQUEST_TIMEOUT_SECONDS = 2.0
MERCADO_LIVRE_MAX_QUERIES = 6
GOOGLE_SHOPPING_MAX_WORKERS = 4
GOOGLE_IMAGES_MAX_WORKERS = 4

MARKETPLACE_BY_INDEX = [marketplace["value"] for marketplace in MARKETPLACES]
MARKETPLACE_LABELS = {marketplace["value"]: marketplace["label"] for marketplace in MARKETPLACES}
MARKETPLACE_LABELS["google_shopping"] = "Google Shopping"
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

GOOGLE_SHOPPING_SEARCH_QUERIES = {
    "technology": ["smartwatch barato", "fone bluetooth", "carregador turbo usb c"],
    "beauty": ["escova secadora", "kit skincare", "massageador facial"],
    "home": ["organizador de casa", "aspirador portatil", "luminaria led"],
    "toys": ["brinquedo educativo", "lego infantil", "brinquedo montessori"],
    "pets": ["bebedouro pet automatico", "cama pet lavavel", "coleira led pet"],
    "fashion": ["bolsa transversal feminina", "relogio masculino", "tenis casual feminino"],
    "tools": ["parafusadeira bateria", "kit ferramentas", "trena laser"],
    "automotive": ["suporte veicular magnetico", "camera de re veicular", "aspirador automotivo"],
    "decoration": ["luminaria led decorativa", "vaso decorativo", "quadro decorativo"],
    "health": ["umidificador de ar", "balanca digital", "massageador cervical"],
    "sports": ["garrafa termica esportiva", "corda speed", "luva treino academia"],
    "games": ["mouse gamer", "headset gamer", "controle mobile"],
    "stationery": ["planner semanal", "caneta gel kit", "organizador de mesa"],
    "kitchen": ["cortador de legumes", "pote hermetico kit", "garrafa inox"],
    "organization": ["caixa organizadora", "divisor de gaveta", "cabide multifuncional"],
}

SHOPPING_SOURCE_MARKETPLACES = {
    "mercado livre": "mercado_livre",
    "mercadolivre": "mercado_livre",
    "amazon": "amazon",
    "shopee": "shopee",
    "ali express": "aliexpress",
    "aliexpress": "aliexpress",
    "tiktok": "tiktok_shop",
    "magalu": "magalu",
    "magazine luiza": "magalu",
    "shein": "shein",
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

        if source in {"auto", "google_shopping", "shopping"}:
            google_products = self._fetch_google_shopping_products()
            if source in {"google_shopping", "shopping"}:
                return google_products

            products = list(google_products)
            mercado_livre_products = self._fetch_mercado_livre_products()
            if mercado_livre_products:
                products.extend(mercado_livre_products)

            catalog_products = self._fetch_dummyjson_products()
            if catalog_products:
                products.extend(catalog_products)

            if products:
                return self._ensure_catalog_coverage(_dedupe_products(products))

        if source == "mercado_livre":
            mercado_livre_products = self._fetch_mercado_livre_products()
            if mercado_livre_products:
                return self._ensure_catalog_coverage(mercado_livre_products)

            # If Mercado Livre is unavailable, keep the API responsive with the
            # lightweight catalog before falling back to simulated coverage.
            catalog_products = self._fetch_dummyjson_products()
            if catalog_products:
                return self._ensure_catalog_coverage(catalog_products)

        if source in {"dummyjson", "catalog"}:
            catalog_products = self._fetch_dummyjson_products()
            if catalog_products:
                return self._ensure_catalog_coverage(catalog_products)

        return self._fallback_products()

    def _fetch_google_shopping_products(self) -> list[Product]:
        api_key = self._settings.serpapi_api_key
        if not api_key:
            return []

        queries = _google_shopping_query_plan()

        max_queries = max(1, min(self._settings.google_shopping_max_queries, len(queries)))
        selected_queries = queries[:max_queries]
        products: list[Product] = []

        with ThreadPoolExecutor(max_workers=min(GOOGLE_SHOPPING_MAX_WORKERS, max_queries)) as executor:
            futures = {
                executor.submit(self._fetch_google_shopping_query, niche, query): (niche, query)
                for niche, query in selected_queries
            }
            for future in as_completed(futures):
                try:
                    products.extend(future.result())
                except (requests.RequestException, TypeError, ValueError):
                    continue

        return self._enrich_products_with_google_images(_dedupe_products(products))

    def _fetch_google_shopping_query(self, niche: str, query: str) -> list[Product]:
        response = requests.get(
            SERPAPI_SEARCH_URL,
            params={
                "engine": "google_shopping",
                "q": query,
                "api_key": self._settings.serpapi_api_key,
                "gl": self._settings.google_shopping_country,
                "hl": self._settings.google_shopping_language,
                "location": self._settings.google_shopping_location,
                "num": GOOGLE_SHOPPING_RESULTS_PER_QUERY,
            },
            headers={
                "Accept": "application/json",
                "User-Agent": "ProductHunterAI/1.0",
            },
            timeout=GOOGLE_SHOPPING_REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        payload = response.json()
        shopping_results = payload.get("shopping_results") or []
        products = [
            _google_shopping_to_product(item, niche, index)
            for index, item in enumerate(shopping_results[:GOOGLE_SHOPPING_RESULTS_PER_QUERY], start=1)
        ]
        return [product for product in products if product is not None]

    def _enrich_products_with_google_images(self, products: list[Product]) -> list[Product]:
        api_key = self._settings.serpapi_api_key
        per_product = max(1, min(self._settings.google_images_per_product, 5))
        if not api_key or not self._settings.google_images_enabled or per_product <= 1:
            return [_with_image_gallery(product, product.image_urls or [product.image_url], limit=per_product) for product in products]

        max_products = max(1, min(self._settings.google_images_max_products, len(products)))
        selected_products = products[:max_products]
        image_results: dict[int, list[str]] = {}

        with ThreadPoolExecutor(max_workers=min(GOOGLE_IMAGES_MAX_WORKERS, max_products)) as executor:
            futures = {
                executor.submit(self._fetch_google_image_urls, product, per_product): product.id
                for product in selected_products
            }
            for future in as_completed(futures):
                product_id = futures[future]
                try:
                    image_results[product_id] = future.result()
                except (requests.RequestException, TypeError, ValueError):
                    image_results[product_id] = []

        enriched: list[Product] = []
        for product in products:
            google_images = image_results.get(product.id, [])
            image_urls = _usable_image_urls([*google_images, *product.image_urls, product.image_url], limit=per_product)
            enriched.append(_with_image_gallery(product, image_urls, limit=per_product))

        return enriched

    def _fetch_google_image_urls(self, product: Product, limit: int) -> list[str]:
        response = requests.get(
            SERPAPI_SEARCH_URL,
            params={
                "engine": "google_images",
                "q": f"{product.name} produto {product.niche_label}",
                "api_key": self._settings.serpapi_api_key,
                "gl": self._settings.google_shopping_country,
                "hl": self._settings.google_shopping_language,
                "ijn": 0,
            },
            headers={
                "Accept": "application/json",
                "User-Agent": "ProductHunterAI/1.0",
            },
            timeout=GOOGLE_IMAGES_REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        images_results = response.json().get("images_results") or []
        candidates: list[str | None] = []
        for item in images_results[:GOOGLE_IMAGES_RESULTS_PER_QUERY]:
            candidates.extend([item.get("original"), item.get("thumbnail")])
        return _usable_image_urls(candidates, limit=limit)

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
                    return self._enrich_products_with_google_images(_dedupe_products(products))
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

        return self._enrich_products_with_google_images(_dedupe_products(products))

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
                    "image_url": None,
                    "image_urls": [],
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


def _google_shopping_query_plan() -> list[tuple[str, str]]:
    max_terms = max(len(search_terms) for search_terms in GOOGLE_SHOPPING_SEARCH_QUERIES.values())
    queries: list[tuple[str, str]] = []

    for term_index in range(max_terms):
        for niche_config in NICHES:
            niche = niche_config["value"]
            search_terms = GOOGLE_SHOPPING_SEARCH_QUERIES.get(niche, [])
            if term_index < len(search_terms):
                queries.append((niche, search_terms[term_index]))

    return queries


def _google_shopping_to_product(item: dict[str, Any], niche: str, index: int) -> Product | None:
    try:
        title = str(item.get("title") or "").strip()
        if not title:
            return None

        price = _parse_price(item.get("extracted_price") or item.get("price"))
        if price is None or price <= 0:
            return None

        source_name = str(item.get("source") or item.get("seller") or "Google Shopping").strip()
        product_link = _https_url(item.get("product_link") or item.get("link") or item.get("serpapi_product_api"))
        image_url = _https_url(item.get("thumbnail") or item.get("image"))
        if not image_url:
            return None

        source_key = item.get("product_id") or product_link or title
        source_id = f"google_shopping:{source_key}"
        marketplace = _infer_shopping_marketplace(source_name, product_link)
        rating = float(item.get("rating") or item.get("extracted_rating") or 4.2)
        reviews_count = _parse_int(item.get("reviews") or item.get("reviews_count")) or 80
        comparison_count = _parse_int(item.get("number_of_comparisons") or item.get("product_count")) or 0
        delivery_days = _delivery_days_from_text(str(item.get("delivery") or item.get("shipping") or ""))
        discount_hint = 7 + (index % 5) * 2
        estimated_cost_ratio = 0.50 if price <= 140 else 0.54

        return Product(
            id=_stable_product_id(source_id),
            name=title,
            marketplace=marketplace,
            marketplace_label=MARKETPLACE_LABELS.get(marketplace, source_name or "Google Shopping"),
            niche=niche,
            niche_label=NICHE_LABELS[niche],
            category=f"Google Shopping - {NICHE_LABELS[niche]}",
            image_url=image_url,
            image_urls=_usable_image_urls([image_url], limit=3),
            product_url=product_link,
            source="google_shopping",
            source_product_id=source_id,
            average_price=round(price, 2),
            min_price=round(price * 0.92, 2),
            max_price=round(price * 1.16, 2),
            estimated_cost=round(price * estimated_cost_ratio, 2),
            platform_fee_percent=_marketplace_fee(marketplace),
            estimated_shipping=0 if "gratis" in str(item.get("delivery") or "").lower() else 16,
            packaging_cost=round(2.8 + min(7, price * 0.012), 2),
            estimated_tax_percent=0.065,
            affiliate_commission_percent=round(0.05 + min(0.08, discount_hint / 500), 4),
            competitors_count=max(18, 120 - min(comparison_count, 80) + index * 3),
            search_volume=max(950, 1800 + comparison_count * 260 + reviews_count * 10),
            trend_score=round(_clamp(52 + rating * 7 + min(reviews_count, 1500) * 0.012 + comparison_count * 0.55, 15, 98), 2),
            average_rating=round(_clamp(rating, 0, 5), 2),
            reviews_count=max(0, reviews_count),
            sales_velocity=round(_clamp(42 + rating * 5 + min(reviews_count, 1300) * 0.018 + comparison_count * 0.45, 8, 98), 2),
            return_risk=round(_clamp(39 - rating * 3 + delivery_days * 0.8, 5, 88), 2),
            seasonality=round(_clamp(34 + (index % 8) * 5, 5, 92), 2),
            product_weight_kg=_weight_for_niche(niche, price),
            delivery_days=delivery_days,
            supplier_reliability=round(_clamp(66 + rating * 5 + min(comparison_count, 40) * 0.3, 35, 98), 2),
            visual_appeal=92 if image_url else 58,
            kit_potential=round(_clamp(44 + comparison_count * 0.4 + (index % 4) * 5, 5, 96), 2),
            recurrence_score=round(_recurrence_for_niche(niche, ""), 2),
            created_for_demo=False,
        )
    except (KeyError, TypeError, ValueError):
        return None


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
        image_url = _https_url(item.get("thumbnail") or next(iter(item.get("images") or []), None))
        return Product(
            id=_stable_product_id(source_id),
            name=str(item["title"]),
            marketplace=marketplace,
            marketplace_label=MARKETPLACE_LABELS[marketplace],
            niche=niche,
            niche_label=NICHE_LABELS[niche],
            category=CATEGORY_LABELS.get(category, category.replace("-", " ").title()),
            image_url=image_url,
            image_urls=_usable_image_urls([image_url, *list(item.get("images") or [])], limit=3),
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
            image_urls=_usable_image_urls([image_url], limit=3),
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
        "google_shopping": 0.13,
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


def _with_image_gallery(product: Product, image_urls: list[str | None], limit: int = 3) -> Product:
    usable_urls = _usable_image_urls(image_urls, limit=limit)
    return product.model_copy(update={"image_url": usable_urls[0] if usable_urls else None, "image_urls": usable_urls})


def _usable_image_urls(values: list[Any], limit: int = 3) -> list[str]:
    seen: set[str] = set()
    usable_urls: list[str] = []

    for value in values:
        url = _https_url(value)
        if not url or not _is_usable_product_image_url(url):
            continue
        if url in seen:
            continue
        seen.add(url)
        usable_urls.append(url)
        if len(usable_urls) >= limit:
            break

    return usable_urls


def _is_usable_product_image_url(value: str) -> bool:
    lower_value = value.lower()
    if not lower_value.startswith(("http://", "https://")):
        return False
    if "dummyjson.com/image/" in lower_value and "text=" in lower_value:
        return False
    if any(host in lower_value for host in ("placehold.co", "placeholder.com", "via.placeholder.com", "dummyimage.com")):
        return False
    return True


def _parse_price(value: Any) -> float | None:
    if isinstance(value, (int, float)):
        return float(value)
    if not value:
        return None

    text = str(value).strip()
    is_usd = "us$" in text.lower() or "usd" in text.lower()
    cleaned = re.sub(r"[^\d,.\-]", "", text)
    if not cleaned:
        return None

    if "," in cleaned and "." in cleaned:
        if cleaned.rfind(",") > cleaned.rfind("."):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif "," in cleaned:
        integer, _, decimals = cleaned.rpartition(",")
        if len(decimals) <= 2:
            cleaned = integer.replace(".", "") + "." + decimals
        else:
            cleaned = cleaned.replace(",", "")
    else:
        parts = cleaned.split(".")
        if len(parts) > 2:
            cleaned = "".join(parts[:-1]) + "." + parts[-1]

    try:
        price = float(cleaned)
    except ValueError:
        return None
    return round(price * BRL_PER_USD, 2) if is_usd else round(price, 2)


def _parse_int(value: Any) -> int | None:
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    if not value:
        return None

    digits = re.sub(r"[^\d]", "", str(value))
    return int(digits) if digits else None


def _infer_shopping_marketplace(source_name: str, product_link: Any) -> str:
    searchable = f"{source_name} {product_link or ''}".lower()
    for token, marketplace in SHOPPING_SOURCE_MARKETPLACES.items():
        if token in searchable:
            return marketplace
    return "google_shopping"


def _delivery_days_from_text(value: str) -> int:
    text = _strip_accents(value.lower())
    if not text:
        return 6
    if any(token in text for token in ("hoje", "amanha", "24h")):
        return 1
    if "gratis" in text:
        return 4

    parsed = _parse_int(text)
    if parsed:
        return int(_clamp(parsed, 1, 25))
    return 6


def _weight_for_niche(niche: str, price: float) -> float:
    base = {
        "beauty": 0.25,
        "fashion": 0.35,
        "stationery": 0.22,
        "technology": 0.42,
        "games": 0.55,
        "automotive": 0.75,
        "tools": 0.95,
        "home": 0.9,
        "kitchen": 0.62,
        "organization": 0.68,
        "sports": 0.54,
        "pets": 0.82,
        "toys": 0.5,
        "decoration": 0.7,
        "health": 0.45,
    }.get(niche, 0.55)
    return round(_clamp(base + price / 1800, 0.08, 4.0), 2)


def _strip_accents(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    return "".join(character for character in normalized if not unicodedata.combining(character))


def _stable_product_id(value: str) -> int:
    return zlib.crc32(value.encode("utf-8")) & 0x7FFFFFFF


def _https_url(value: Any) -> str | None:
    if not value:
        return None
    value = str(value).strip()
    if not value:
        return None
    if value.startswith("http://"):
        return value.replace("http://", "https://", 1)
    return value


def _clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))
