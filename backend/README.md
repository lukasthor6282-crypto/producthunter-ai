# ProductHunter AI Backend

Backend FastAPI responsavel pela inteligencia do ProductHunter AI.

Ele centraliza:

- dados simulados de produtos;
- calculo de margem e lucro;
- score de oportunidade;
- score de risco;
- motor de recomendacao;
- Machine Learning com Scikit-learn;
- login com Google;
- banco SQLAlchemy para usuarios e sessoes;
- endpoints consumidos pelo frontend.

## Rodar Localmente

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

Swagger:

```text
http://127.0.0.1:8000/docs
```

## Variaveis de Ambiente

```powershell
$env:GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
$env:SESSION_COOKIE_SECURE="false"
$env:CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

O SQLite e criado automaticamente em `backend/producthunter.db`. Para trocar para PostgreSQL:

```powershell
$env:DATABASE_URL="postgresql+psycopg://usuario:senha@host:5432/producthunter"
$env:SESSION_COOKIE_SECURE="true"
```

Em producao, mantenha HTTPS ativo, use `SESSION_COOKIE_SECURE=true` e restrinja `CORS_ORIGINS` ao dominio real do SaaS.

## Produtos reais com fotos

O provider principal usa `PRODUCT_SOURCE=auto`. Ele tenta a API oficial do Mercado Livre quando `MERCADO_LIVRE_ACCESS_TOKEN` estiver configurado e, se nao conseguir, usa um catalogo publico com imagens para manter a experiencia visual.

```powershell
$env:PRODUCT_SOURCE="auto"
$env:MERCADO_LIVRE_ACCESS_TOKEN="seu-token-mercado-livre"
$env:PRODUCT_CATALOG_TTL_SECONDS="900"
```

## Estrutura

```text
backend/
  app/
    api/              Rotas FastAPI
    core/             Configuracao por variaveis de ambiente
    data_providers/   Fontes de dados simuladas e abstracoes futuras
    db.py             Engine SQLAlchemy e criacao das tabelas
    dependencies/     Dependencias de autenticacao
    ml/               Features, treino, metricas e previsao
    models/           Tabelas de usuarios e sessoes
    schemas/          Schemas Pydantic
    services/         Recomendacao, lucro, score, analytics e explicacoes
    utils/            Constantes e normalizacao
  requirements.txt
  README.md
```

## Endpoints

### Health

```http
GET /health
```

Retorna o status da API.

### Autenticacao

```http
GET /auth/config
POST /auth/google
GET /auth/me
POST /auth/logout
```

`/auth/google` recebe a credencial JWT retornada pelo Google Identity Services, valida o token no backend e cria uma sessao com cookie `HttpOnly`. As rotas de recomendacao, lucro, ML e analytics exigem login.

### Produtos

```http
GET /products
GET /products/search
GET /products/{product_id}
```

Retorna produtos simulados e permite busca por marketplace, nicho e texto.

### Recomendacoes

```http
POST /recommendations/generate
```

Payload exemplo:

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

Retorna ranking com:

- produto;
- score de oportunidade;
- margem estimada;
- lucro estimado;
- conversao estimada;
- concorrencia;
- risco;
- estrategia recomendada;
- publico-alvo;
- explicacao textual da IA;
- fatores de decisao;
- alertas.

### Simulador de Lucro

```http
POST /profit/simulate
```

Payload exemplo:

```json
{
  "product_id": 121,
  "monthly_units": 40,
  "ad_cost_per_unit": 2.5,
  "fixed_monthly_cost": 120
}
```

Retorna lucro unitario, lucro mensal, ROI, margem, ponto de equilibrio, taxas, frete e custos.

### Machine Learning

```http
POST /ml/predict
GET /ml/explain
```

`/ml/predict` gera previsoes para:

- `conversion_probability`
- `estimated_margin`
- `estimated_profit`
- `opportunity_score`
- `risk_score`

`/ml/explain` retorna dataset, features, targets, metricas, importancia das variaveis e explicacoes didaticas.

### Analytics

```http
GET /analytics/dashboard
```

Retorna indicadores agregados para o dashboard do frontend.

## Motor de Recomendacao

O motor combina regras explicaveis com sinais de produto e perfil.

Principais entradas:

- tipo de operacao;
- marketplace;
- nicho;
- objetivo;
- investimento;
- nivel de experiencia;
- tipo de trafego;
- atributos do produto.

Principais calculos:

- margem liquida estimada;
- lucro por unidade;
- conversao provavel;
- concorrencia;
- risco operacional;
- ajuste ao investimento;
- score de oportunidade ponderado.

Os pesos mudam de acordo com o perfil. Por exemplo:

- afiliado valoriza comissao, conversao e baixo risco operacional;
- dropshipping penaliza prazo, peso e confiabilidade baixa;
- iniciante favorece produtos menos arriscados;
- objetivo `low_competition` aumenta o peso de concorrencia;
- objetivo `margin_and_conversion` equilibra margem e conversao.

## Machine Learning

O modelo atual usa Scikit-learn:

- `RandomForestRegressor`;
- `MultiOutputRegressor`;
- `train_test_split`;
- metricas `MAE`, `RMSE` e `R2`;
- importancia das variaveis.

No MVP, os targets sao gerados pelas regras explicaveis do motor de recomendacao. Isso permite estudar ML sem depender de dados reais no inicio.

Mais detalhes em [../docs/ml-learning-guide.md](../docs/ml-learning-guide.md).

## Testes Manuais Rapidos

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
Invoke-RestMethod http://127.0.0.1:8000/auth/config
Invoke-RestMethod http://127.0.0.1:8000/products
```

Para compilar os arquivos Python:

```powershell
python -m compileall app
```

## Integracao Com Dados Reais

A arquitetura usa `data_providers` para permitir trocar a origem dos dados no futuro.

Caminho recomendado:

1. manter o schema `Product` como contrato interno;
2. criar um provider por API oficial;
3. normalizar dados externos para o schema interno;
4. registrar origem e data dos dados;
5. adicionar cache e limites de requisicao;
6. revisar termos de uso antes de coletar dados.
