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
$env:ADMIN_EMAILS="seu-email@gmail.com"
$env:SESSION_COOKIE_SECURE="false"
$env:CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

`ADMIN_EMAILS` aceita um ou mais e-mails separados por virgula. Quando uma conta Google com esse e-mail faz login ou faz uma nova requisicao autenticada, o backend marca o usuario como administrador em `users.is_admin`.

O SQLite e criado automaticamente em `backend/producthunter.db`. Para trocar para PostgreSQL:

```powershell
$env:DATABASE_URL="postgresql+psycopg://usuario:senha@host:5432/producthunter"
$env:SESSION_COOKIE_SECURE="true"
```

Em producao, mantenha HTTPS ativo, use `SESSION_COOKIE_SECURE=true` e restrinja `CORS_ORIGINS` ao dominio real do SaaS.

## Seguranca Operacional

A API adiciona headers de seguranca em todas as respostas, bloqueia payloads grandes pelo `Content-Length` e aplica rate limit em endpoints sensiveis.

Rotas autenticadas por cookie tambem validam `Origin`/`Referer` em metodos de escrita (`POST`, `PUT`, `PATCH`, `DELETE`). Isso reduz risco de CSRF quando a sessao `HttpOnly` e enviada automaticamente pelo navegador. As origens aceitas sao as mesmas configuradas em `CORS_ORIGINS`.

No login, o backend tambem limita sessoes ativas por usuario e limpa sessoes expiradas ou revogadas antigas.

Variaveis ajustaveis:

```powershell
$env:MAX_REQUEST_BODY_BYTES="1048576"
$env:AUTH_RATE_LIMIT_COUNT="12"
$env:AUTH_RATE_LIMIT_WINDOW_SECONDS="60"
$env:RECOMMENDATION_RATE_LIMIT_COUNT="30"
$env:RECOMMENDATION_RATE_LIMIT_WINDOW_SECONDS="60"
$env:SESSION_MAX_ACTIVE_PER_USER="5"
$env:SESSION_REVOKED_RETENTION_DAYS="30"
```

## Migracoes do Banco

O backend usa Alembic para versionar o schema do banco. No startup, a API executa `upgrade head` automaticamente. Se o banco ja existir e ainda nao tiver a tabela `alembic_version`, o backend preserva as tabelas atuais e marca o schema como versionado.

Comandos manuais, quando precisar validar antes do deploy:

```powershell
cd backend
python -m alembic upgrade head
python -m alembic current
```

No Render, mantenha o start command apontando para a API normalmente:

```text
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

As migracoes rodam durante o startup da API.

## Produtos reais com fotos

O provider principal usa `PRODUCT_SOURCE=auto`. Ele tenta Google Shopping por API configuravel quando `SERPAPI_API_KEY` estiver definida, combina com Mercado Livre quando houver `MERCADO_LIVRE_ACCESS_TOKEN` e, se nao conseguir, usa um catalogo publico com imagens para manter a experiencia visual.

Para ativar coleta via Google Shopping, use um provedor de SERP/API como SerpApi. O app nao raspa HTML do Google diretamente; ele consome a API configurada e normaliza os resultados para o schema interno.

```powershell
$env:PRODUCT_SOURCE="auto"
$env:SERPAPI_API_KEY="sua-chave-serpapi"
$env:GOOGLE_SHOPPING_MAX_QUERIES="15"
$env:GOOGLE_SHOPPING_COUNTRY="br"
$env:GOOGLE_SHOPPING_LANGUAGE="pt"
$env:GOOGLE_SHOPPING_LOCATION="Brazil"
$env:GOOGLE_IMAGES_ENABLED="true"
$env:GOOGLE_IMAGES_PER_PRODUCT="3"
$env:GOOGLE_IMAGES_MAX_PRODUCTS="120"
$env:MERCADO_LIVRE_ACCESS_TOKEN="seu-token-mercado-livre"
$env:PRODUCT_CATALOG_TTL_SECONDS="900"
```

Use `PRODUCT_SOURCE="google_shopping"` para forcar apenas Google Shopping. Nesse modo, o provider nao injeta produtos simulados para completar volume e aceita apenas resultados com foto. A foto principal e salva em `image_url` e ate 3 fotos sao salvas em `image_urls`, permitindo abrir/copiar cada link no detalhe do produto. Antes de usar imagens em anuncios ou criativos, valide permissao/licenca com a fonte do produto.

## Estrutura

```text
backend/
  app/
    api/              Rotas FastAPI
    core/             Configuracao por variaveis de ambiente
    data_providers/   Fontes de dados simuladas e abstracoes futuras
    db.py             Engine SQLAlchemy e sessao do banco
    db_migrations.py  Execucao das migracoes no startup
    dependencies/     Dependencias de autenticacao
    ml/               Features, treino, metricas e previsao
    models/           Tabelas de usuarios e sessoes
    schemas/          Schemas Pydantic
    services/         Recomendacao, lucro, score, analytics e explicacoes
    utils/            Constantes e normalizacao
  migrations/         Versoes Alembic do schema
  alembic.ini
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
GET /auth/security-events
POST /auth/logout
```

`/auth/google` recebe a credencial JWT retornada pelo Google Identity Services, valida o token no backend e cria uma sessao com cookie `HttpOnly`. Eventos de login e logout sao registrados em `security_audit_events`, e o usuario autenticado pode consultar os eventos recentes em `/auth/security-events`. As rotas de recomendacao, lucro, ML e analytics exigem login.

### Administracao

```http
GET /admin/overview
GET /admin/users
PATCH /admin/users/{user_id}
```

Essas rotas exigem uma conta com `is_admin=true`. Use `ADMIN_EMAILS` no ambiente de producao para promover sua conta Google.

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
