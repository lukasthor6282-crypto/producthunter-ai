# ProductHunter AI Frontend

Frontend React do ProductHunter AI.

A interface apresenta o produto como um SaaS premium de inteligencia comercial, com foco em recomendacao de produtos, leitura de oportunidade, simulacao de lucro e aprendizado de Machine Learning.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- TanStack Query
- Google Identity Services

## Rodar Localmente

```powershell
cd C:\Users\lukas\Downloads\producthunter-ai\frontend
npm install
npm run dev -- --port 5173
```

App:

```text
http://127.0.0.1:5173
```

O backend precisa estar rodando em:

```text
http://127.0.0.1:8000
```

Para o login funcionar, configure `GOOGLE_CLIENT_ID` no backend. O frontend busca esse Client ID em:

```text
GET http://127.0.0.1:8000/auth/config
```

Se quiser usar outra URL de API, defina:

```powershell
$env:VITE_API_URL="http://127.0.0.1:8000"
npm run dev -- --port 5173
```

## Build

```powershell
npm run build
```

Observacao: o Vite pode avisar que alguns chunks passam de 500 kB por causa de bibliotecas visuais como Recharts e Framer Motion. Isso e um aviso de otimizacao futura, nao necessariamente um erro.

## Estrutura

```text
frontend/
  src/
    components/
      animation/       Fundo, orbs e efeitos visuais
      auth/            Botao Google Identity Services
      charts/          Graficos Recharts
      dashboard/       Cards e indicadores do dashboard
      layout/          Header e Sidebar
      ml/              Loading e elementos do Laboratorio de IA
      product/         Cards de produto
      recommendation/  Formulario e explicacoes
      ui/              GlassCard, GlowButton e elementos reutilizaveis
    hooks/             Hooks de produtos e recomendacoes
    pages/             Telas principais
    services/          Cliente HTTP e formatadores
    styles/            CSS global e Tailwind
    types/             Tipos TypeScript
```

## Telas

- Landing Page: primeira experiencia e chamada para comecar.
- Login: acesso com conta Google e sessao segura.
- Dashboard: metricas gerais, tendencias e nichos.
- Perfil de Recomendacao: formulario com tipo de operacao, marketplace, nicho, objetivo, investimento, experiencia e trafego.
- Resultado da Recomendacao: ranking de produtos e explicacao da IA.
- Produto: detalhes do produto selecionado.
- Simulador de Lucro: estimativa financeira.
- Laboratorio de IA: explicacao visual do modelo, metricas e importancia das variaveis.

## Integracao Com API

O cliente HTTP fica em:

```text
src/services/api.ts
```

Por padrao, a API base e:

```text
http://127.0.0.1:8000
```

Servicos principais:

- `getAuthConfig`
- `getCurrentSession`
- `loginWithGoogleCredential`
- `logoutSession`
- `generateRecommendations`
- `simulateProfit`
- `predictML`
- `explainML`
- `listProducts`
- `getDashboardAnalytics`

## Sistema Visual

O frontend segue um estilo premium inspirado em Claude Design, Apple, Linear, Vercel e computacao espacial.

Elementos principais:

- fundo escuro com gradientes;
- superficies glassmorphism;
- bordas brilhantes;
- reflexos internos;
- bento grid;
- hover e microinteracoes com Framer Motion;
- icones Lucide;
- graficos Recharts;
- tipografia Inter/SF Pro-like.

Mais detalhes em [../docs/design-system.md](../docs/design-system.md).

## Boas Praticas

- manter componentes reutilizaveis em `components/ui`;
- manter telas em `pages`;
- nao duplicar chamadas HTTP fora de `services`;
- tipar respostas da API em `types`;
- preservar responsividade mobile e desktop;
- evitar texto explicativo demais dentro da UI operacional;
- usar graficos apenas quando eles ajudam a decisao.
