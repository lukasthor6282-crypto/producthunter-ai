from __future__ import annotations

import random
from typing import Any

from app.data_providers.marketplace_provider_base import MarketplaceProviderBase
from app.utils.constants import MARKETPLACES, NICHES
from app.utils.normalization import clamp, slugify, soft_round


NICHE_PRODUCTS: dict[str, list[tuple[str, str, float]]] = {
    "Tecnologia": [
        ("Mini impressora termica portatil", "Acessorios tecnologicos", 129),
        ("Carregador turbo GaN compacto", "Energia e carregamento", 149),
        ("Suporte magnetico para celular", "Acessorios mobile", 69),
    ],
    "Beleza": [
        ("Massageador facial eletrico", "Skincare", 99),
        ("Escova secadora compacta", "Cabelo", 189),
        ("Kit organizador de maquiagem", "Organizacao beauty", 79),
    ],
    "Casa": [
        ("Luminaria sensor de movimento", "Iluminacao", 89),
        ("Aspirador portatil USB", "Limpeza", 159),
        ("Organizador multiuso modular", "Organizacao domestica", 69),
    ],
    "Brinquedos": [
        ("Jogo educativo de encaixe", "Educativo", 64),
        ("Pista flexivel com carrinho", "Brinquedos criativos", 119),
        ("Projetor infantil de historias", "Brinquedos interativos", 139),
    ],
    "Pets": [
        ("Bebedouro automatico para pets", "Acessorios pet", 139),
        ("Escova removedora de pelos", "Higiene pet", 49),
        ("Tapete gelado para cachorro", "Conforto pet", 89),
    ],
    "Moda": [
        ("Bolsa transversal minimalista", "Bolsas", 129),
        ("Camiseta modal premium", "Basicos", 79),
        ("Relogio casual unissex", "Acessorios", 149),
    ],
    "Ferramentas": [
        ("Parafusadeira eletrica compacta", "Ferramentas eletricas", 219),
        ("Kit chaves precisao magneticas", "Ferramentas manuais", 69),
        ("Medidor laser de distancia", "Medicao", 179),
    ],
    "Automotivo": [
        ("Mini aspirador automotivo", "Limpeza automotiva", 109),
        ("Suporte veicular articulado", "Acessorios internos", 59),
        ("Compressor portatil para pneus", "Emergencia automotiva", 199),
    ],
    "Decoracao": [
        ("Fita LED inteligente", "Iluminacao decorativa", 119),
        ("Vaso autoirrigavel moderno", "Plantas e vasos", 79),
        ("Quadro decorativo minimalista", "Parede", 99),
    ],
    "Saude": [
        ("Massageador cervical portatil", "Bem-estar", 159),
        ("Garrafa termica motivacional", "Hidratacao", 79),
        ("Corretor postural ajustavel", "Cuidados pessoais", 69),
    ],
    "Esportes": [
        ("Elastico extensor de treino", "Fitness", 49),
        ("Rolo miofascial texturizado", "Recuperacao", 79),
        ("Bolsa esportiva impermeavel", "Acessorios esportivos", 129),
    ],
    "Games": [
        ("Controle mobile bluetooth", "Acessorios gamer", 169),
        ("Mouse gamer leve RGB", "Perifericos", 139),
        ("Suporte headset com carregador", "Setup gamer", 119),
    ],
    "Papelaria": [
        ("Caderno inteligente argolado", "Organizacao escolar", 89),
        ("Kit canetas brush lettering", "Criatividade", 59),
        ("Planner semanal magnetico", "Produtividade", 69),
    ],
    "Cozinha": [
        ("Cortador multifuncional de legumes", "Preparo", 89),
        ("Balança digital culinaria", "Utensilios", 69),
        ("Mixer portatil recarregavel", "Eletroportateis", 129),
    ],
    "Organizacao": [
        ("Caixa organizadora dobravel", "Organizacao modular", 79),
        ("Divisoria ajustavel para gavetas", "Organizacao pessoal", 49),
        ("Prateleira adesiva sem furos", "Otimizacao de espaco", 69),
    ],
}

MARKETPLACE_FACTORS = {
    "Mercado Livre": {"fee": 0.145, "delivery": 4, "competition": 1.18, "demand": 1.15},
    "Amazon": {"fee": 0.155, "delivery": 5, "competition": 1.08, "demand": 1.08},
    "Shopee": {"fee": 0.13, "delivery": 7, "competition": 1.25, "demand": 1.22},
    "AliExpress": {"fee": 0.09, "delivery": 16, "competition": 0.96, "demand": 0.94},
    "TikTok Shop": {"fee": 0.11, "delivery": 6, "competition": 0.92, "demand": 1.34},
    "Magalu": {"fee": 0.16, "delivery": 5, "competition": 1.02, "demand": 1.01},
    "Shein": {"fee": 0.12, "delivery": 9, "competition": 0.88, "demand": 0.98},
}


class SimulatedMarketplaceProvider(MarketplaceProviderBase):
    """Creates deterministic fake data for study, demos, and MVP development."""

    def __init__(self, seed: int = 42) -> None:
        self.seed = seed
        self._products: list[dict[str, Any]] | None = None

    def list_products(self) -> list[dict[str, Any]]:
        if self._products is None:
            self._products = self._build_products()
        return list(self._products)

    def _build_products(self) -> list[dict[str, Any]]:
        random.seed(self.seed)
        products: list[dict[str, Any]] = []

        for marketplace in MARKETPLACES:
            factors = MARKETPLACE_FACTORS[marketplace]
            for niche in NICHES:
                templates = NICHE_PRODUCTS[niche]
                for variant_index, (name, category, base_price) in enumerate(templates):
                    price_multiplier = random.uniform(0.84, 1.28) * factors["demand"]
                    average_price = soft_round(base_price * price_multiplier)
                    min_price = soft_round(average_price * random.uniform(0.72, 0.88))
                    max_price = soft_round(average_price * random.uniform(1.12, 1.45))
                    estimated_cost = soft_round(average_price * random.uniform(0.38, 0.67))
                    competitor_count = int(random.randint(22, 260) * factors["competition"])
                    trend_score = soft_round(clamp(random.gauss(62, 18), 8, 98), 1)
                    rating_average = soft_round(clamp(random.gauss(4.45, 0.32), 3.2, 4.95), 2)
                    review_count = int(random.triangular(18, 4800, 520))
                    search_volume = int(random.triangular(1200, 82000, 18000) * factors["demand"])
                    sales_velocity = soft_round(random.triangular(8, 420, 65) * factors["demand"], 1)
                    return_risk = soft_round(clamp(random.gauss(0.22, 0.12), 0.04, 0.72), 2)
                    seasonality_score = soft_round(clamp(random.gauss(0.38, 0.22), 0.02, 0.92), 2)
                    product_weight = soft_round(random.triangular(0.08, 3.4, 0.55), 2)
                    supplier_reliability = soft_round(clamp(random.gauss(0.82, 0.12), 0.42, 0.98), 2)
                    delivery_time = int(max(2, factors["delivery"] + random.gauss(0, 2.6)))
                    product_id = f"{slugify(marketplace)}-{slugify(niche)}-{variant_index + 1}"

                    products.append(
                        {
                            "product_id": product_id,
                            "product_name": name,
                            "marketplace": marketplace,
                            "niche": niche,
                            "category": category,
                            "average_price": average_price,
                            "min_price": min_price,
                            "max_price": max_price,
                            "estimated_cost": estimated_cost,
                            "marketplace_fee_percent": soft_round(
                                clamp(factors["fee"] + random.uniform(-0.018, 0.018), 0.06, 0.22), 3
                            ),
                            "shipping_cost": soft_round(7.5 + product_weight * random.uniform(4.2, 12.5), 2),
                            "packaging_cost": soft_round(random.uniform(1.2, 4.9), 2),
                            "estimated_tax_percent": soft_round(random.uniform(0.035, 0.095), 3),
                            "affiliate_commission_percent": soft_round(random.uniform(0.04, 0.18), 3),
                            "competitor_count": competitor_count,
                            "search_volume": search_volume,
                            "trend_score": trend_score,
                            "rating_average": rating_average,
                            "review_count": review_count,
                            "sales_velocity": sales_velocity,
                            "return_risk": return_risk,
                            "seasonality_score": seasonality_score,
                            "product_weight": product_weight,
                            "supplier_reliability": supplier_reliability,
                            "delivery_time_days": delivery_time,
                        }
                    )

        return products

