from __future__ import annotations

from typing import Any


def target_audience_for(product: dict[str, Any]) -> str:
    audiences = {
        "Tecnologia": "criadores de conteudo, estudantes e pequenos empreendedores",
        "Beleza": "consumidores de autocuidado e revendedores de cosmeticos",
        "Casa": "familias que buscam praticidade e organizacao",
        "Pets": "tutores que compram por recorrencia e conveniencia",
        "Moda": "publico urbano que compra por estilo e impulso visual",
        "Games": "gamers casuais e pessoas montando setup",
        "Cozinha": "pessoas que cozinham em casa e buscam agilidade",
    }
    return audiences.get(product["niche"], "compradores que buscam praticidade, preco acessivel e prova social")


def strategy_for(product: dict[str, Any], profile: dict[str, Any]) -> str:
    operation = profile.get("operation_type", "Vendedor").lower()
    traffic = profile.get("traffic_type", "Marketplace").lower()
    if "afiliado" in operation:
        return "Videos curtos com demonstracao, prova social e CTA direto para o link de afiliado."
    if "drop" in operation:
        return "Validar fornecedor, destacar prazo real de entrega e vender com criativos de beneficio claro."
    if "revendedor" in operation:
        return "Montar kits, negociar lote inicial pequeno e testar giro antes de ampliar estoque."
    if "loja" in operation:
        return "Criar pacote de valor com upsell, identidade propria e sequencia de recompra."
    if "pago" in traffic:
        return "Anuncio com angulo de problema-solucao, margem minima protegida e teste A/B de criativos."
    return "Anuncio otimizado no marketplace com fotos claras, titulo rico em busca e video curto demonstrando uso."


def reason_for(product: dict[str, Any], profile: dict[str, Any], metrics: dict[str, float | str]) -> str:
    margin = int(float(metrics["estimated_margin"]) * 100)
    conversion = int(float(metrics["conversion_probability"]) * 100)
    risk = int(float(metrics["risk_score"]))
    return (
        f"Boa aderencia ao perfil {profile.get('operation_type', 'Vendedor').lower()} em "
        f"{profile.get('marketplace', product['marketplace'])}: margem estimada de {margin}%, "
        f"conversao prevista de {conversion}% e risco {risk}/100. O produto combina demanda, "
        "prova social e execucao simples para testar no MVP."
    )


def narrative_for(profile: dict[str, Any], top_product: dict[str, Any] | None) -> str:
    if top_product is None:
        return "Nao encontramos produtos suficientes para esse filtro. Tente ampliar marketplace ou nicho."
    return (
        f"Com base no seu perfil de {profile.get('operation_type', 'vendedor').lower()} em "
        f"{profile.get('marketplace')} no nicho de {profile.get('niche')}, o melhor caminho agora e apostar em "
        f"{top_product['product_name']}. Ele equilibra margem, demanda, concorrencia e risco de forma mais forte "
        "que as alternativas analisadas."
    )

