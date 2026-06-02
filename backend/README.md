# Backend ProductHunter AI

Backend FastAPI responsavel pela inteligencia do MVP.

## Rodar

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Endpoints principais

- `GET /health`
- `GET /products`
- `GET /products/search`
- `GET /products/{product_id}`
- `POST /recommendations/profile`
- `POST /recommendations/generate`
- `POST /products/compare`
- `POST /profit/simulate`
- `POST /ml/predict`
- `GET /ml/explain`
- `GET /ml/metrics`
- `GET /analytics/dashboard`
- `POST /favorites`
- `GET /favorites`

## Camadas

- `data_providers`: fontes simuladas, CSV e base para providers futuros.
- `services`: scoring, recomendacao, lucro, analytics e explicacoes.
- `ml`: features, treino, registry e predicao.
- `schemas`: contratos Pydantic da API.
- `models`: modelos ORM preparados para persistencia futura.

## Observacao

O MVP nao faz scraping. A evolucao para dados reais deve usar APIs oficiais, CSVs autorizados, programas de afiliados e dados internos.

