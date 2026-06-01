MARKETPLACES = [
    {"value": "mercado_livre", "label": "Mercado Livre"},
    {"value": "amazon", "label": "Amazon"},
    {"value": "shopee", "label": "Shopee"},
    {"value": "aliexpress", "label": "AliExpress"},
    {"value": "tiktok_shop", "label": "TikTok Shop"},
    {"value": "magalu", "label": "Magalu"},
    {"value": "shein", "label": "Shein"},
]

NICHES = [
    {"value": "technology", "label": "Tecnologia"},
    {"value": "beauty", "label": "Beleza"},
    {"value": "home", "label": "Casa"},
    {"value": "toys", "label": "Brinquedos"},
    {"value": "pets", "label": "Pets"},
    {"value": "fashion", "label": "Moda"},
    {"value": "tools", "label": "Ferramentas"},
    {"value": "automotive", "label": "Automotivo"},
    {"value": "decoration", "label": "Decoracao"},
    {"value": "health", "label": "Saude"},
    {"value": "sports", "label": "Esportes"},
    {"value": "games", "label": "Games"},
    {"value": "stationery", "label": "Papelaria"},
    {"value": "kitchen", "label": "Cozinha"},
    {"value": "organization", "label": "Organizacao"},
]

OPERATION_TYPES = [
    {"value": "affiliate", "label": "Afiliado"},
    {"value": "seller", "label": "Vendedor"},
    {"value": "dropshipping", "label": "Dropshipping"},
    {"value": "reseller", "label": "Revendedor"},
    {"value": "own_store", "label": "Loja propria"},
]

GOALS = [
    {"value": "highest_profit", "label": "Maior lucro"},
    {"value": "fast_turnover", "label": "Giro rapido"},
    {"value": "low_competition", "label": "Baixa concorrencia"},
    {"value": "high_conversion", "label": "Alta conversao"},
    {"value": "viral_product", "label": "Produto viral"},
    {"value": "high_ticket", "label": "Ticket alto"},
    {"value": "high_commission", "label": "Comissao alta"},
    {"value": "beginner_product", "label": "Produto para iniciante"},
    {"value": "low_risk", "label": "Baixo risco"},
    {"value": "margin_and_conversion", "label": "Boa margem e alta conversao"},
]

INVESTMENT_RANGES = [
    {"value": "up_to_500", "label": "Ate R$ 500", "min": 0, "max": 500},
    {"value": "500_to_2000", "label": "R$ 500 a R$ 2.000", "min": 500, "max": 2000},
    {"value": "2000_to_5000", "label": "R$ 2.000 a R$ 5.000", "min": 2000, "max": 5000},
    {"value": "5000_plus", "label": "Acima de R$ 5.000", "min": 5000, "max": 20000},
]

EXPERIENCE_LEVELS = [
    {"value": "beginner", "label": "Iniciante"},
    {"value": "intermediate", "label": "Intermediario"},
    {"value": "advanced", "label": "Avancado"},
]

TRAFFIC_TYPES = [
    {"value": "marketplace", "label": "Marketplace"},
    {"value": "paid_ads", "label": "Trafego pago"},
    {"value": "organic", "label": "Organico"},
    {"value": "social", "label": "Redes sociais"},
    {"value": "influencer", "label": "Influenciador"},
]

MARKETPLACE_ALIASES = {
    "mercado livre": "mercado_livre",
    "mercadolivre": "mercado_livre",
    "ml": "mercado_livre",
    "amazon": "amazon",
    "shopee": "shopee",
    "ali express": "aliexpress",
    "aliexpress": "aliexpress",
    "tiktok": "tiktok_shop",
    "tiktok shop": "tiktok_shop",
    "magalu": "magalu",
    "shein": "shein",
}

NICHE_ALIASES = {
    "tecnologia": "technology",
    "technology": "technology",
    "beleza": "beauty",
    "beauty": "beauty",
    "casa": "home",
    "home": "home",
    "brinquedos": "toys",
    "toys": "toys",
    "pets": "pets",
    "moda": "fashion",
    "fashion": "fashion",
    "ferramentas": "tools",
    "tools": "tools",
    "automotivo": "automotive",
    "automotive": "automotive",
    "decoracao": "decoration",
    "decoração": "decoration",
    "saude": "health",
    "saúde": "health",
    "health": "health",
    "esportes": "sports",
    "sports": "sports",
    "games": "games",
    "papelaria": "stationery",
    "stationery": "stationery",
    "cozinha": "kitchen",
    "kitchen": "kitchen",
    "organizacao": "organization",
    "organização": "organization",
    "organization": "organization",
}

OPERATION_ALIASES = {
    "afiliado": "affiliate",
    "affiliate": "affiliate",
    "vendedor": "seller",
    "seller": "seller",
    "dropshipping": "dropshipping",
    "drop": "dropshipping",
    "revendedor": "reseller",
    "reseller": "reseller",
    "loja propria": "own_store",
    "loja própria": "own_store",
    "own_store": "own_store",
}

GOAL_ALIASES = {
    "boa margem e alta conversao": "margin_and_conversion",
    "boa margem e alta conversão": "margin_and_conversion",
    "margin_and_conversion": "margin_and_conversion",
    "maior lucro": "highest_profit",
    "highest_profit": "highest_profit",
    "giro rapido": "fast_turnover",
    "giro rápido": "fast_turnover",
    "fast_turnover": "fast_turnover",
    "baixa concorrencia": "low_competition",
    "baixa concorrência": "low_competition",
    "low_competition": "low_competition",
    "alta conversao": "high_conversion",
    "alta conversão": "high_conversion",
    "high_conversion": "high_conversion",
    "produto viral": "viral_product",
    "viral_product": "viral_product",
    "ticket alto": "high_ticket",
    "high_ticket": "high_ticket",
    "comissao alta": "high_commission",
    "comissão alta": "high_commission",
    "high_commission": "high_commission",
    "produto para iniciante": "beginner_product",
    "beginner_product": "beginner_product",
    "baixo risco": "low_risk",
    "low_risk": "low_risk",
}

PROFILE_DEFAULTS = {
    "operation_type": "seller",
    "marketplace": "shopee",
    "niche": "technology",
    "goal": "margin_and_conversion",
    "investment_range": "500_to_2000",
    "experience_level": "beginner",
    "traffic_type": "marketplace",
}
