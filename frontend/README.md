# Frontend ProductHunter AI

Interface React + TypeScript + Vite para o MVP ProductHunter AI.

## Rodar

```bash
npm install
npm run dev
```

Por padrao, o frontend chama `http://127.0.0.1:8000`.

Para trocar a API:

```bash
VITE_API_URL=http://127.0.0.1:8000 npm run dev
```

## Telas

- Landing Page
- Dashboard
- Perfil de Recomendacao
- Resultado da Recomendacao
- Analise Individual do Produto
- Comparacao de Produtos
- Simulador de Lucro
- Laboratorio de IA

## Componentes

O app inclui shell com sidebar/header, glass panels, cards com tilt 3D, charts, ranking, simulador, painel de IA e fallback local caso a API ainda nao esteja rodando.

