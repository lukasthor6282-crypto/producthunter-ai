# Design System

## Direcao visual

ProductHunter AI usa uma interface escura, premium e operacional, inspirada em SaaS modernos de IA. A prioridade e clareza, densidade organizada e sensacao de produto vendavel.

## Paleta

- Background: `#05070a`
- Surface glass: `rgba(7, 13, 22, 0.72)`
- Border: `rgba(221, 255, 244, 0.14)`
- Text: `#f7fbff`
- Muted: `#9fb5c8`
- Mint: `#81f3c8`
- Cyan: `#60d8ff`
- Amber: `#ffd166`
- Danger: `#ff7a90`

## Tipografia

- Fonte principal: Inter
- Titulos: peso 700/800
- UI labels: 12px a 14px, sem letter spacing negativo
- Corpo: 14px a 18px com line-height confortavel

## Componentes

- `GlassCard`
- `GlassPanel`
- `TiltCard3D`
- `GlowButton`
- `Sidebar`
- `Header`
- `ProductOpportunityCard`
- `OpportunityScoreRing`
- `RiskIndicator`
- `RecommendationForm`
- `ProductRankingTable`
- `ProfitSimulationCard`
- `AILabPanel`

## Movimento

- Entradas curtas com Framer Motion
- Stagger leve para areas principais
- Tilt 3D em cards de produto
- Loading de IA com pulso discreto
- Respeito a `prefers-reduced-motion`

## Regras de manutencao

- Evitar aparencia de template generico
- Evitar excesso de decoracao
- Manter cards com raio pequeno
- Preferir componentes reutilizaveis
- Usar icons Lucide para comandos e estados
- Garantir contraste e responsividade antes de adicionar efeitos
