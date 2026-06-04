from app.schemas.product_schema import Product
from app.schemas.profile_schema import UserProfile


def _format_brl(value: float) -> str:
    return f"R$ {value:,.0f}".replace(",", ".")


TARGET_AUDIENCES = {
    "technology": "compradores que buscam praticidade, gadgets acessiveis e upgrades rapidos",
    "beauty": "publico de autocuidado, creators de beleza e compradores recorrentes",
    "home": "familias e pessoas que querem melhorar a rotina da casa",
    "toys": "pais, maes e presentes educativos de ticket acessivel",
    "pets": "tutores que compram por conforto, saude e mimo para pets",
    "fashion": "consumidores guiados por tendencia, preco e composicao de looks",
    "tools": "publico DIY, manutencao domestica e pequenos profissionais",
    "automotive": "motoristas que compram acessorios praticos para o dia a dia",
    "decoration": "pessoas montando ambientes modernos com baixo investimento",
    "health": "publico interessado em bem-estar e rotina saudavel",
    "sports": "iniciantes em treino e compradores de acessorios fitness",
    "games": "gamers que buscam setup melhor com ticket medio acessivel",
    "stationery": "estudantes, criadores e profissionais que valorizam organizacao",
    "kitchen": "compradores que querem praticidade e economia de tempo na cozinha",
    "organization": "publico que consome conteudo de casa organizada e rotina visual",
}


def build_strategy(product: Product, profile: UserProfile, score_breakdown: dict[str, float] | None = None) -> str:
    score_breakdown = score_breakdown or {}
    margin = score_breakdown.get("margin", 0)
    conversion = score_breakdown.get("conversion", 0)
    trend = score_breakdown.get("trend", product.trend_score)

    if profile.operation_type == "affiliate":
        return (
            "Criar videos curtos demonstrando uso real, abrir com o problema que o produto resolve "
            "e usar prova social para aumentar o clique. Priorize criativos visuais e chamada para "
            "oferta direta."
        )
    if profile.operation_type == "dropshipping":
        return (
            "Validar com poucos anuncios, destacar prazo de entrega e confiabilidade do fornecedor. "
            "Comece com volume pequeno para medir atraso, suporte e taxa de reembolso."
        )
    if profile.operation_type == "own_store":
        return (
            "Montar kits, bundles e oferta com identidade propria para aumentar ticket medio e "
            "diferenciacao."
        )
    if profile.operation_type == "reseller":
        return (
            "Comprar lote pequeno, testar preco em tres faixas e reinvestir apenas nos anuncios "
            "com melhor giro."
        )
    if margin >= 65 and conversion >= 55:
        return (
            "Comecar com estoque enxuto, posicionar o anuncio no beneficio principal e testar preco "
            "ligeiramente acima da media. A combinacao de margem e conversao permite validar sem "
            "sacrificar lucro."
        )
    if trend >= 70:
        return (
            "Aproveitar a tendencia com criativos rapidos, titulo orientado por busca e monitoramento "
            "semanal de concorrentes para nao perder timing."
        )
    return (
        "Comecar com estoque controlado, posicionar o anuncio por beneficio principal e acompanhar "
        "margem, frete e concorrencia semanalmente."
    )


def build_decision_factors(
    product: Product,
    score_breakdown: dict[str, float],
    margin_percent: float,
    conversion_probability: float,
    risk_score: float,
) -> list[str]:
    factors: list[tuple[float, str]] = [
        (score_breakdown.get("margin", 0), f"margem liquida estimada de {margin_percent:.1f}%"),
        (score_breakdown.get("competition_inverse", 0), "concorrencia relativamente baixa"),
        (product.trend_score, "tendencia positiva no nicho escolhido"),
        (conversion_probability, f"conversao provavel de {conversion_probability:.1f}%"),
        (score_breakdown.get("investment_fit", 0), "produto compativel com a faixa de investimento"),
        (product.supplier_reliability, "boa confiabilidade do fornecedor"),
        (100 - risk_score, "risco operacional controlado"),
    ]
    selected = [text for score, text in sorted(factors, key=lambda item: item[0], reverse=True) if score >= 55]
    return selected[:4] or ["equilibrio aceitavel entre preco, demanda, margem e risco"]


def build_warnings(product: Product, risk_score: float, score_breakdown: dict[str, float]) -> list[str]:
    warnings: list[str] = []
    if risk_score >= 58:
        warnings.append("Risco acima do ideal; valide com lote pequeno antes de escalar.")
    if product.delivery_days >= 14:
        warnings.append("Prazo de entrega alto pode reduzir conversao e aumentar suporte.")
    if product.return_risk >= 55:
        warnings.append("Risco de devolucao relevante; capriche na descricao e expectativa do anuncio.")
    if score_breakdown.get("investment_fit", 100) < 55:
        startup_investment = score_breakdown.get("startup_investment")
        if startup_investment:
            warnings.append(
                f"Investimento inicial estimado de {_format_brl(startup_investment)} pressiona a verba informada."
            )
        else:
            warnings.append("Produto pressiona a faixa de investimento informada.")
    if product.competitors_count >= 260:
        warnings.append("Concorrencia numerosa; sera importante diferenciar titulo, imagem e oferta.")
    return warnings[:3]


def build_explanation(
    product: Product,
    profile: UserProfile,
    opportunity_score: float,
    margin_percent: float,
    conversion_probability: float,
    risk_score: float,
    score_breakdown: dict[str, float] | None = None,
) -> str:
    score_breakdown = score_breakdown or {}
    factors = build_decision_factors(
        product=product,
        score_breakdown=score_breakdown,
        margin_percent=margin_percent,
        conversion_probability=conversion_probability,
        risk_score=risk_score,
    )
    joined_strengths = ", ".join(factors[:3])
    operation_context = {
        "affiliate": "divulgacao como afiliado",
        "seller": "venda com estoque",
        "dropshipping": "operacao de dropshipping",
        "reseller": "revenda com lote controlado",
        "own_store": "loja propria",
    }.get(profile.operation_type, "perfil informado")
    return (
        f"Este produto foi recomendado porque combina {joined_strengths} dentro do nicho "
        f"{product.niche_label} no {product.marketplace_label}. Para {operation_context}, o score "
        f"{opportunity_score:.1f} indica uma oportunidade com boa relacao entre retorno esperado e risco."
    )


def target_audience_for(product: Product) -> str:
    return TARGET_AUDIENCES.get(product.niche, "compradores com interesse ativo no nicho")
