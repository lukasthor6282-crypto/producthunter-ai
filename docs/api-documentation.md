# API Documentation

Base local: `http://127.0.0.1:8000`

## Health

`GET /health`

Retorna status da API.

## Produtos

`GET /products`

Query params:

- `marketplace`
- `niche`
- `limit`

`GET /products/search?query=mini`

Busca por nome, categoria, nicho ou marketplace.

`GET /products/{product_id}`

Retorna detalhes de um produto.

`POST /products/compare`

Compara de 2 a 5 produtos para um perfil.

## Recomendacoes

`POST /recommendations/profile`

Analisa o perfil e retorna pesos de score.

`POST /recommendations/generate`

Body:

```json
{
  "operation_type": "Vendedor",
  "marketplace": "Shopee",
  "niche": "Tecnologia",
  "goal": "Maior lucro",
  "investment_range": "R$ 500 a R$ 2.000",
  "experience_level": "Iniciante",
  "traffic_type": "Marketplace",
  "limit": 8
}
```

## Lucro

`POST /profit/simulate`

Calcula lucro por unidade, margem liquida, lucro mensal e ponto de equilibrio.

## Machine Learning

`POST /ml/predict`

Retorna previsoes do modelo para produtos.

`GET /ml/explain`

Explica features, targets e evolucao do modelo.

`GET /ml/metrics`

Treina/carrega o modelo e retorna metricas.

## Analytics

`GET /analytics/dashboard`

Retorna oportunidades do dia, nichos aquecidos, produtos com boa margem e alertas.

## Favoritos

`POST /favorites`

Salva um produto favorito em memoria no MVP.

`GET /favorites`

Lista favoritos da sessao.

