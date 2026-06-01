from __future__ import annotations

from functools import lru_cache

import numpy as np
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool

from app.schemas.product_schema import Product
from app.utils.constants import MARKETPLACES, NICHES


PRODUCT_TEMPLATES = {
    "technology": ["Smartwatch Pro", "Mini Projetor", "Fone Bluetooth", "Carregador Turbo"],
    "beauty": ["Escova Secadora", "Serum Facial", "Kit Skincare", "Massageador Facial"],
    "home": ["Organizador Modular", "Aspirador Portatil", "Varal Retratil", "Luminaria Mesa"],
    "toys": ["Blocos Magneticos", "Robozinho Educativo", "Kit Pintura", "Jogo Montessori"],
    "pets": ["Cama Pet Lavavel", "Bebedouro Fonte", "Escova Removedora", "Coleira LED"],
    "fashion": ["Bolsa Transversal", "Jaqueta Corta Vento", "Oculos Polarizado", "Top Fitness"],
    "tools": ["Parafusadeira Compacta", "Kit Chaves", "Trena Laser", "Mini Compressor"],
    "automotive": ["Suporte Veicular", "Aspirador Automotivo", "Camera Re", "Carregador Veicular"],
    "decoration": ["Luminaria LED", "Quadro Minimalista", "Vaso Ceramico", "Fita Neon"],
    "health": ["Massageador Cervical", "Umidificador", "Balança Digital", "Kit Yoga"],
    "sports": ["Faixa Elastica", "Garrafa Termica", "Luva Treino", "Corda Speed"],
    "games": ["Controle Mobile", "Mouse Gamer", "Headset RGB", "Suporte Headset"],
    "stationery": ["Planner Premium", "Caneta Gel Kit", "Organizador Mesa", "Caderno Inteligente"],
    "kitchen": ["Air Fryer Acessorio", "Cortador Legumes", "Garrafa Inox", "Pote Hermetico"],
    "organization": ["Caixa Organizadora", "Divisor Gaveta", "Cabide Multifuncao", "Prateleira Modular"],
}

CATEGORIES = {
    "technology": "Eletronicos",
    "beauty": "Cuidados pessoais",
    "home": "Casa util",
    "toys": "Infantil",
    "pets": "Pet shop",
    "fashion": "Vestuário",
    "tools": "Ferramentas manuais",
    "automotive": "Acessorios auto",
    "decoration": "Decoracao interna",
    "health": "Bem-estar",
    "sports": "Fitness",
    "games": "Acessorios gamer",
    "stationery": "Papelaria criativa",
    "kitchen": "Cozinha pratica",
    "organization": "Organizacao domestica",
}

MARKETPLACE_FACTORS = {
    "mercado_livre": {"fee": 0.14, "shipping": 18, "delivery": 4, "competition": 1.12},
    "amazon": {"fee": 0.15, "shipping": 16, "delivery": 5, "competition": 1.02},
    "shopee": {"fee": 0.13, "shipping": 12, "delivery": 7, "competition": 1.08},
    "aliexpress": {"fee": 0.11, "shipping": 15, "delivery": 18, "competition": 0.88},
    "tiktok_shop": {"fee": 0.10, "shipping": 14, "delivery": 8, "competition": 0.72},
    "magalu": {"fee": 0.16, "shipping": 20, "delivery": 6, "competition": 0.94},
    "shein": {"fee": 0.12, "shipping": 13, "delivery": 10, "competition": 0.82},
}

NICHE_PRICE_BASE = {
    "technology": 185,
    "beauty": 95,
    "home": 120,
    "toys": 80,
    "pets": 90,
    "fashion": 110,
    "tools": 150,
    "automotive": 130,
    "decoration": 105,
    "health": 140,
    "sports": 115,
    "games": 170,
    "stationery": 55,
    "kitchen": 100,
    "organization": 75,
}


class SimulatedProductProvider:
    def __init__(self) -> None:
        self._engine = create_engine(
            "sqlite+pysqlite://",
            future=True,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self._seed_database(_build_products())

    def list_products(self) -> list[Product]:
        frame = self.to_dataframe()
        return [Product(**row) for row in frame.to_dict(orient="records")]

    def get_product(self, product_id: int) -> Product | None:
        with self._engine.connect() as connection:
            frame = pd.read_sql(
                text("select * from products where id = :product_id"),
                connection,
                params={"product_id": product_id},
            )
        if frame.empty:
            return None
        return Product(**frame.iloc[0].to_dict())

    def to_dataframe(self) -> pd.DataFrame:
        with self._engine.connect() as connection:
            return pd.read_sql(text("select * from products order by id"), connection)

    def _seed_database(self, products: list[Product]) -> None:
        frame = pd.DataFrame([product.model_dump() for product in products])
        frame.to_sql("products", self._engine, if_exists="replace", index=False)


@lru_cache(maxsize=1)
def get_provider() -> SimulatedProductProvider:
    return SimulatedProductProvider()


def _build_products() -> list[Product]:
    rng = np.random.default_rng(20260531)
    products: list[Product] = []
    product_id = 1

    for marketplace_index, marketplace in enumerate(MARKETPLACES):
        market_factor = MARKETPLACE_FACTORS[marketplace["value"]]
        for niche_index, niche in enumerate(NICHES):
            names = PRODUCT_TEMPLATES[niche["value"]]
            for variant in range(4):
                base_price = NICHE_PRICE_BASE[niche["value"]]
                demand_boost = 1 + (niche_index % 5) * 0.04 + (marketplace_index % 3) * 0.05
                average_price = float(
                    np.round(base_price * rng.uniform(0.75, 1.7) * (1 + variant * 0.12), 2)
                )
                min_price = float(np.round(average_price * rng.uniform(0.72, 0.9), 2))
                max_price = float(np.round(average_price * rng.uniform(1.12, 1.42), 2))
                estimated_cost = float(np.round(average_price * rng.uniform(0.38, 0.67), 2))
                platform_fee_percent = float(
                    np.round(max(0.07, market_factor["fee"] + rng.normal(0, 0.012)), 4)
                )
                estimated_shipping = float(
                    np.round(max(6, market_factor["shipping"] * rng.uniform(0.75, 1.45)), 2)
                )
                packaging_cost = float(np.round(rng.uniform(1.2, 8.5), 2))
                estimated_tax_percent = float(np.round(rng.uniform(0.035, 0.105), 4))
                affiliate_commission_percent = float(np.round(rng.uniform(0.045, 0.18), 4))
                competitors_count = int(
                    max(8, rng.normal(150 * market_factor["competition"], 58))
                )
                search_volume = int(max(600, rng.normal(8800 * demand_boost, 2800)))
                trend_score = float(np.round(np.clip(rng.normal(61 + variant * 7, 18), 12, 98), 2))
                average_rating = float(np.round(np.clip(rng.normal(4.35, 0.38), 3.1, 5), 2))
                reviews_count = int(max(20, rng.normal(950 * demand_boost, 650)))
                sales_velocity = float(np.round(np.clip(rng.normal(57 * demand_boost, 16), 8, 98), 2))
                return_risk = float(np.round(np.clip(rng.normal(30, 17), 4, 88), 2))
                seasonality = float(np.round(np.clip(rng.normal(48, 22), 5, 95), 2))
                product_weight_kg = float(np.round(rng.uniform(0.08, 3.2), 2))
                delivery_days = int(max(2, np.round(market_factor["delivery"] + rng.normal(0, 2.2))))
                supplier_reliability = float(np.round(np.clip(rng.normal(78, 13), 35, 99), 2))
                visual_appeal = float(np.round(np.clip(rng.normal(65, 18), 20, 99), 2))
                kit_potential = float(np.round(np.clip(rng.normal(50, 22), 5, 98), 2))
                recurrence_score = float(np.round(np.clip(rng.normal(42, 25), 3, 96), 2))

                products.append(
                    Product(
                        id=product_id,
                        name=f"{names[(variant + marketplace_index) % len(names)]} {marketplace['label']}",
                        marketplace=marketplace["value"],
                        marketplace_label=marketplace["label"],
                        niche=niche["value"],
                        niche_label=niche["label"],
                        category=CATEGORIES[niche["value"]],
                        average_price=average_price,
                        min_price=min_price,
                        max_price=max_price,
                        estimated_cost=estimated_cost,
                        platform_fee_percent=platform_fee_percent,
                        estimated_shipping=estimated_shipping,
                        packaging_cost=packaging_cost,
                        estimated_tax_percent=estimated_tax_percent,
                        affiliate_commission_percent=affiliate_commission_percent,
                        competitors_count=competitors_count,
                        search_volume=search_volume,
                        trend_score=trend_score,
                        average_rating=average_rating,
                        reviews_count=reviews_count,
                        sales_velocity=sales_velocity,
                        return_risk=return_risk,
                        seasonality=seasonality,
                        product_weight_kg=product_weight_kg,
                        delivery_days=delivery_days,
                        supplier_reliability=supplier_reliability,
                        visual_appeal=visual_appeal,
                        kit_potential=kit_potential,
                        recurrence_score=recurrence_score,
                    )
                )
                product_id += 1

    return products
