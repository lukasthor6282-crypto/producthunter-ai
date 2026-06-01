# Documentacao da API

Base local:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## GET /health

Verifica se a API esta ativa.

Resposta:

```json
{
  "status": "ok",
  "service": "ProductHunter AI API"
}
```

## GET /metadata/options

Retorna opcoes usadas pelo formulario do frontend.

Inclui:

- tipos de operacao;
- marketplaces;
- nichos;
- objetivos;
- faixas de investimento;
- niveis de experiencia;
- tipos de trafego.

## GET /products

Lista produtos simulados.

## GET /products/search

Busca produtos por filtros.

Parametros comuns:

- `marketplace`
- `niche`
- `query`
- `limit`

Exemplo:

```text
GET /products/search?marketplace=shopee&niche=technology&limit=10
```

## GET /products/{product_id}

Retorna um produto especifico.

Exemplo:

```text
GET /products/121
```

## POST /recommendations/generate

Gera ranking de produtos recomendados.

Request:

```json
{
  "operation_type": "seller",
  "marketplace": "shopee",
  "niche": "technology",
  "goal": "margin_and_conversion",
  "investment_range": "500_to_2000",
  "experience_level": "beginner",
  "traffic_type": "marketplace",
  "limit": 5
}
```

Campos aceitos:

- `operation_type`: `affiliate`, `seller`, `dropshipping`, `reseller`, `own_store`
- `marketplace`: `mercado_livre`, `amazon`, `shopee`, `aliexpress`, `tiktok_shop`, `magalu`, `shein`
- `niche`: `technology`, `beauty`, `home`, `toys`, `pets`, `fashion`, `tools`, `automotive`, `decoration`, `health`, `sports`, `games`, `stationery`, `kitchen`, `organization`
- `goal`: `highest_profit`, `fast_turnover`, `low_competition`, `high_conversion`, `viral_product`, `high_ticket`, `high_commission`, `beginner_product`, `low_risk`, `margin_and_conversion`
- `investment_range`: `up_to_500`, `500_to_2000`, `2000_to_5000`, `5000_plus`
- `experience_level`: `beginner`, `intermediate`, `advanced`
- `traffic_type`: `marketplace`, `paid_ads`, `organic`, `social`, `influencer`

Resposta resumida:

```json
{
  "profile": {},
  "total_candidates": 4,
  "recommendations": [
    {
      "product": {},
      "opportunity_score": 62.73,
      "estimated_margin_percent": 32.1,
      "estimated_profit": 88.4,
      "conversion_probability": 41.2,
      "competition_score": 33.8,
      "risk_score": 31.82,
      "recommended_strategy": "Validar com campanha pequena...",
      "target_audience": "Consumidores...",
      "explanation": "Este produto foi recomendado porque...",
      "score_breakdown": {},
      "decision_factors": [],
      "warnings": []
    }
  ],
  "applied_filters": {},
  "message": "Ranking gerado com sucesso."
}
```

## POST /profit/simulate

Simula lucro por produto.

Request:

```json
{
  "product_id": 121,
  "monthly_units": 40,
  "ad_cost_per_unit": 2.5,
  "fixed_monthly_cost": 120
}
```

Tambem aceita valores manuais:

- `average_price`
- `estimated_cost`
- `platform_fee_percent`
- `estimated_shipping`
- `packaging_cost`
- `estimated_tax_percent`

Resposta:

```json
{
  "product_id": 121,
  "unit_revenue": 129.9,
  "unit_cost": 44.49,
  "unit_profit": 85.41,
  "margin_percent": 65.75,
  "monthly_profit": 3296.4,
  "breakeven_units": 2,
  "platform_fee_value": 18.19,
  "tax_value": 7.79,
  "shipping_value": 9.5,
  "packaging_value": 2.5,
  "ad_cost_per_unit": 2.5,
  "fixed_monthly_cost": 120,
  "gross_monthly_profit": 3416.4,
  "net_monthly_profit": 3296.4,
  "roi_percent": 40.37,
  "contribution_margin_percent": 71.2
}
```

## POST /ml/predict

Executa previsao do modelo de ML para um perfil e, opcionalmente, um produto.

Request:

```json
{
  "profile": {
    "operation_type": "seller",
    "marketplace": "shopee",
    "niche": "technology",
    "goal": "margin_and_conversion",
    "investment_range": "500_to_2000",
    "experience_level": "beginner",
    "traffic_type": "marketplace"
  },
  "product_id": 121
}
```

Resposta:

```json
{
  "product_id": 121,
  "product_name": "Fone Bluetooth Shopee",
  "conversion_probability": 41.2,
  "estimated_margin": 31.4,
  "estimated_profit": 88.0,
  "opportunity_score": 65.65,
  "risk_score": 32.65,
  "model_type": "MultiOutputRegressor(RandomForestRegressor)",
  "interpretation": "boa oportunidade com validacao controlada",
  "top_features": ["gross_spread", "price_to_cost_ratio", "sales_velocity"],
  "metrics": {}
}
```

## GET /ml/explain

Retorna informacoes didaticas do modelo:

- modelo usado;
- resumo do dataset;
- features;
- targets;
- treino e teste;
- metricas;
- importancia das variaveis;
- melhorias futuras.

## GET /analytics/dashboard

Retorna dados agregados para o dashboard:

- total de produtos;
- margem media;
- conversao media;
- risco medio;
- series de tendencia;
- top nichos.

## Erros

Validacoes retornam `422` com detalhe e dica.

Exemplo:

```json
{
  "detail": "Dados invalidos na requisicao.",
  "errors": [],
  "hint": "Verifique operation_type, marketplace, niche, goal, investment_range, experience_level e traffic_type."
}
```
