# ProductHunter AI

ProductHunter AI e um SaaS MVP para recomendar produtos com maior potencial de lucro, conversao e oportunidade para vendedores, afiliados, dropshippers, revendedores e lojas proprias.

O usuario comeca pelo perfil:

- tipo de operacao
- marketplace
- nicho
- objetivo
- investimento
- experiencia
- tipo de trafego

A API cruza esse perfil com um catalogo simulado, calcula margem, lucro, concorrencia, conversao, risco e score de oportunidade, e retorna um ranking explicado em linguagem simples.

## Stack

Backend:

- Python
- FastAPI
- Pandas
- NumPy
- Scikit-learn
- SQLAlchemy
- Pydantic
- SQLite no MVP, com `DATABASE_URL` preparado para PostgreSQL

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts

## Como rodar

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs padrao:

- Backend: `http://127.0.0.1:8000`
- Docs OpenAPI: `http://127.0.0.1:8000/docs`
- Frontend: `http://127.0.0.1:5173`

Se o backend estiver em outra URL, configure:

```bash
VITE_API_URL=http://127.0.0.1:8000 npm run dev
```

## Como funciona a recomendacao

1. O `simulated_provider.py` gera um dataset fake realista com mais de 150 produtos.
2. O backend filtra por marketplace e nicho.
3. O `scoring_service.py` calcula lucro, margem, conversao, risco e score.
4. Os pesos mudam conforme o tipo de operacao e o objetivo do usuario.
5. O `recommendation_service.py` ordena os produtos e gera uma narrativa consultiva.

## Como funciona o ML

O MVP usa regras de negocio para criar targets didaticos e treina um `RandomForestRegressor` para prever:

- `conversion_probability`
- `estimated_margin`
- `estimated_profit`
- `opportunity_score`
- `risk_score`

Isso permite aprender o fluxo de Machine Learning sem depender de dados reais no primeiro momento.

## Dados simulados

Todos os dados do MVP sao simulados para estudo, prototipo e validacao de produto. Eles nao devem ser usados como recomendacao financeira real.

Para evoluir:

- importar CSVs autorizados
- conectar APIs oficiais
- adicionar historico de precos
- usar dados internos de vendas
- registrar comportamento do usuario

## Estrutura

```text
backend/
  app/
    api/
    data_providers/
    ml/
    models/
    schemas/
    services/
frontend/
  src/
    components/
    hooks/
    pages/
    services/
    types/
docs/
```

## Documentacao

- [Modelo de negocio](docs/business-model.md)
- [Guia de Machine Learning](docs/ml-learning-guide.md)
- [Roadmap](docs/product-roadmap.md)
- [API](docs/api-documentation.md)
- [Estrategia de dados](docs/data-strategy.md)
- [Design system](docs/design-system.md)

