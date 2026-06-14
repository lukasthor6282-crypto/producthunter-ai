# ProductHunter AI

ProductHunter AI e um MVP de SaaS de inteligencia artificial para recomendar produtos para vendedores, afiliados, dropshipping, revendedores e lojas proprias.

A pergunta central do produto e:

> Com o meu perfil, em qual produto eu devo apostar agora?

O sistema recebe o perfil comercial do usuario, cruza esse perfil com produtos simulados e retorna um ranking com score de oportunidade, margem estimada, lucro estimado, conversao, concorrencia, risco, explicacao da IA e estrategia recomendada.

## Problema Que Resolve

Vendedores e afiliados normalmente escolhem produtos olhando apenas preco, hype ou intuicao. Isso aumenta o risco de apostar em produtos com margem baixa, concorrencia alta, conversao fraca ou operacao dificil.

O ProductHunter AI ajuda a transformar essa decisao em um processo mais analitico:

- compara produtos por marketplace, nicho e objetivo;
- adapta a recomendacao ao tipo de operacao;
- estima lucro, margem, conversao e risco;
- explica por que um produto faz sentido para o perfil;
- cria uma base para evoluir para dados reais e APIs oficiais.

## Stack

Backend:

- Python
- FastAPI
- Pydantic
- Pandas
- NumPy
- Scikit-learn
- SQLAlchemy
- SQLite no MVP, com `DATABASE_URL` pronto para PostgreSQL

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts

## Estrutura

```text
producthunter-ai/
  backend/              API, motor de recomendacao, ML e dados simulados
  frontend/             Interface web premium em React
  docs/                 Documentacao de produto, dados, ML, API e design
  AGENTS.md             Instrucoes de desenvolvimento do projeto
  README.md             Visao geral e guia rapido
```

## Rodar Localmente

Use dois terminais PowerShell: um para o backend e outro para o frontend.

### Backend

```powershell
cd C:\Users\lukas\Downloads\producthunter-ai\backend
pip install -r requirements.txt
$env:GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API:

```text
http://127.0.0.1:8000
```

Documentacao interativa do FastAPI:

```text
http://127.0.0.1:8000/docs
```

#### Login com Google

O MVP usa Google Identity Services no frontend e valida o ID token no backend com `google-auth`. Crie um OAuth Client ID do tipo Web no Google Cloud e adicione estas origens JavaScript autorizadas:

```text
http://127.0.0.1:5173
http://localhost:5173
```

Para producao com HTTPS, use `SESSION_COOKIE_SECURE=true`. O banco padrao e SQLite em `backend/producthunter.db`; para escalar com PostgreSQL, defina:

```powershell
$env:DATABASE_URL="postgresql+psycopg://usuario:senha@host:5432/producthunter"
```

O backend versiona o schema com Alembic e roda as migracoes automaticamente no startup. Para validar manualmente:

```powershell
cd backend
python -m alembic upgrade head
```

#### Coleta real de produtos

Por padrao, o backend usa `PRODUCT_SOURCE=auto`: tenta Google Shopping via API configuravel quando houver `SERPAPI_API_KEY`, combina Mercado Livre quando houver token e, se nao houver, usa um catalogo publico de produtos com fotos. Para ativar coleta real com imagens, configure:

```powershell
$env:PRODUCT_SOURCE="auto"
$env:SERPAPI_API_KEY="sua-chave-serpapi"
$env:GOOGLE_SHOPPING_MAX_QUERIES="15"
$env:GOOGLE_SHOPPING_COUNTRY="br"
$env:GOOGLE_SHOPPING_LANGUAGE="pt"
$env:GOOGLE_SHOPPING_LOCATION="Brazil"
$env:MERCADO_LIVRE_ACCESS_TOKEN="seu-token-mercado-livre"
$env:PRODUCT_CATALOG_TTL_SECONDS="900"
```

O app nao raspa HTML do Google diretamente; ele usa um provedor/API de resultados e normaliza os produtos para o schema interno. As imagens entram em `image_url` e aparecem no ranking/detalhe, com acao para abrir ou copiar o link da imagem. Valide permissao/licenca antes de usar imagens em anuncios.

#### Assinaturas com Stripe

Planos sugeridos para o MVP:

- Starter: R$ 29/mes, 80 analises por mes
- Pro: R$ 79/mes, 350 analises por mes
- Scale: R$ 149/mes, 1.200 analises por mes e 3 usuarios

Para ativar checkout real, crie produtos recorrentes no Stripe e configure no backend:

```powershell
$env:APP_PUBLIC_URL="https://producthunter-ai.pages.dev"
$env:STRIPE_SECRET_KEY="sk_live_..."
$env:STRIPE_WEBHOOK_SECRET="whsec_..."
$env:STRIPE_PRICE_STARTER="price_..."
$env:STRIPE_PRICE_PRO="price_..."
$env:STRIPE_PRICE_SCALE="price_..."
```

### Frontend

```powershell
cd C:\Users\lukas\Downloads\producthunter-ai\frontend
npm install
npm run dev -- --port 5173
```

App:

```text
http://127.0.0.1:5173
```

## Testar a Recomendacao

Com o backend rodando e uma sessao autenticada:

```powershell
curl.exe -X POST http://127.0.0.1:8000/recommendations/generate `
  -H "Content-Type: application/json" `
  -d "{\"operation_type\":\"seller\",\"marketplace\":\"shopee\",\"niche\":\"technology\",\"goal\":\"margin_and_conversion\",\"investment_range\":\"500_to_2000\",\"experience_level\":\"beginner\",\"traffic_type\":\"marketplace\",\"limit\":5}"
```

Perfil usado no teste:

- Operacao: vendedor
- Marketplace: Shopee
- Nicho: tecnologia
- Objetivo: boa margem e alta conversao
- Investimento: R$ 500 a R$ 2.000
- Experiencia: iniciante
- Trafego: marketplace

## Endpoints Principais

- `GET /health`
- `GET /auth/config`
- `GET /auth/me`
- `POST /auth/google`
- `POST /auth/logout`
- `GET /billing/plans`
- `GET /billing/subscription`
- `POST /billing/checkout`
- `POST /billing/portal`
- `POST /billing/webhook`
- `GET /metadata/options`
- `GET /products`
- `GET /products/search`
- `GET /products/{product_id}`
- `POST /recommendations/generate`
- `POST /profit/simulate`
- `POST /ml/predict`
- `GET /ml/explain`
- `GET /analytics/dashboard`

## Como Funciona

O backend possui tres camadas principais:

- Motor de recomendacao: calcula margem, lucro, conversao, risco e score de oportunidade.
- Machine Learning: treina um modelo Scikit-learn com dados simulados para prever conversao, margem, lucro, oportunidade e risco.
- API FastAPI: expoe endpoints para o frontend consumir ranking, simulador, laboratorio de IA e analytics.

O frontend organiza essa experiencia em landing page, dashboard, formulario de perfil, resultados, produto, simulador de lucro e Laboratorio de IA.

## Documentacao

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)
- [Modelo de negocio](docs/business-model.md)
- [Guia de aprendizado de ML](docs/ml-learning-guide.md)
- [Roadmap do produto](docs/product-roadmap.md)
- [Documentacao da API](docs/api-documentation.md)
- [Estrategia de dados](docs/data-strategy.md)
- [Design system](docs/design-system.md)

## Cuidados Legais

O MVP usa dados simulados. Antes de integrar dados reais:

- priorize APIs oficiais dos marketplaces;
- leia os termos de uso de cada plataforma;
- evite scraping proibido ou coleta agressiva;
- nao colete dados pessoais desnecessarios;
- registre origem, permissao e data de atualizacao dos dados.

Mais detalhes em [Estrategia de dados](docs/data-strategy.md).
