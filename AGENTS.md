# ProductHunter AI — Agent Instructions

## Nome do projeto
ProductHunter AI

## Ideia central
Criar um SaaS de IA que lê o perfil de um vendedor ou afiliado e recomenda os melhores produtos para vender ou divulgar em marketplaces como Mercado Livre, Amazon, Shopee, AliExpress, TikTok Shop, Magalu e Shein.

O sistema deve responder:

"Com o meu perfil, em qual produto eu devo apostar agora?"

## Fluxo principal
O usuário informa:

- Tipo de operação: afiliado, vendedor, dropshipping, revendedor ou loja própria
- Marketplace: Mercado Livre, Amazon, Shopee, AliExpress, TikTok Shop, Magalu, Shein ou outro
- Nicho: tecnologia, beleza, casa, brinquedos, pets, moda, ferramentas, automotivo, decoração, saúde, esportes, games, papelaria, cozinha, organização etc.
- Objetivo: maior lucro, giro rápido, baixa concorrência, alta conversão, produto viral, ticket alto, comissão alta, produto para iniciante ou baixo risco
- Investimento disponível
- Nível de experiência
- Tipo de tráfego

O sistema retorna:

- Ranking de produtos recomendados
- Score de oportunidade
- Margem estimada
- Lucro estimado
- Conversão estimada
- Concorrência
- Risco
- Melhor estratégia
- Público-alvo
- Explicação simples da IA

## Stack backend
Use obrigatoriamente:

- Python
- FastAPI
- Pydantic
- Pandas
- NumPy
- Scikit-learn
- SQLAlchemy
- SQLite no MVP

A inteligência do sistema deve ficar no backend Python.

O backend deve cuidar de:

- Motor de recomendação
- Machine Learning
- Cálculo de margem
- Cálculo de lucro
- Score de oportunidade
- Score de risco
- Dados simulados
- Endpoints da API

## Stack frontend
Use:

## Frontend premium stack

O frontend deve ser criado com foco em qualidade visual de produto premium, como um site/SaaS de alto valor.

Use obrigatoriamente:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- shadcn/ui
- Radix UI
- clsx
- tailwind-merge
- class-variance-authority
- React Hook Form
- Zod
- TanStack Query

Use opcionalmente, quando fizer sentido:

- GSAP para animações cinematográficas
- Lenis para scroll suave
- Three.js, React Three Fiber e Drei para efeitos 3D, partículas e fundos espaciais

## Frontend visual direction

Criar um frontend digno de SaaS premium, estilo site de alto valor.

Referências visuais:

- Claude Design
- Apple
- Linear
- Vercel
- Raycast
- Stripe
- Computação Espacial
- Glassmorphism
- Bento grid
- Interfaces de IA premium

A interface deve parecer cara, moderna, polida e confiável.

## Frontend design rules

Evite completamente:

- aparência genérica de template Tailwind
- fundo chapado
- cards simples sem personalidade
- botões básicos
- espaçamentos desalinhados
- excesso de cores
- animações aleatórias
- layout poluído
- componentes duplicados sem padrão

Crie:

- design system consistente
- tokens de cor
- componentes reutilizáveis
- hierarquia tipográfica forte
- grid bem organizado
- microinterações elegantes
- animações com intenção
- estados de loading bonitos
- estados vazios bem desenhados
- responsividade real
- acabamento visual premium

## Visual style

Use:

- fundo escuro com gradientes dinâmicos
- orbs luminosos flutuantes
- partículas sutis
- camadas de profundidade
- cards glassmorphism
- bordas brilhantes
- reflexos internos
- sombras suaves
- blur elegante
- bento grid
- ícones flutuando em diferentes profundidades
- tipografia Inter parecida com SF Pro
- botões com glow
- painéis com aparência de vidro
- gráficos minimalistas e elegantes

## Motion design

Use Framer Motion como base.

Animações obrigatórias:

- entrada cinematográfica da hero section
- cards entrando com stagger
- hover 3D seguindo o cursor
- brilho acompanhando o mouse nos cards
- botões com microinterações
- loading de IA premium
- transições suaves entre páginas
- reveal no scroll
- gráficos animados
- elementos flutuantes lentos

Usar GSAP apenas se a animação for mais complexa.

Usar Lenis para scroll suave em landing pages.

Usar Three.js/React Three Fiber apenas em efeitos 3D ou background espacial. Não usar 3D pesado sem necessidade.

As animações devem respeitar prefers-reduced-motion.

## Required frontend components

Criar componentes reutilizáveis:

- SpatialBackground
- FloatingOrbs
- ParticleField
- GlassCard
- GlassPanel
- TiltCard3D
- GlowButton
- AnimatedNavbar
- Sidebar
- Header
- BentoGrid
- FeatureCard
- StatsCard
- ProductOpportunityCard
- OpportunityScoreRing
- MarketplaceBadge
- RiskIndicator
- RecommendationForm
- AIAnalysisLoader
- AIExplanationPanel
- ProductRankingTable
- ProductDetailPanel
- ProfitSimulationCard
- ComparisonTable
- TrendChart
- MarginChart
- ConversionChart
- AILabPanel

## Quality rules

- Componentes pequenos e reutilizáveis.
- Separar componentes de layout, UI, dashboard, recommendation, product, charts, ml e animation.
- Usar TypeScript corretamente.
- Evitar any sempre que possível.
- Usar Zod para validar formulários importantes.
- Usar React Hook Form para formulários.
- Usar TanStack Query para chamadas de API.
- Usar shadcn/ui e Radix UI para componentes acessíveis.
- Manter performance boa.
- Não exagerar nos efeitos.
- Priorizar acabamento, consistência e clareza.

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts

## Estilo visual
Criar uma interface premium inspirada em:

- Claude Design
- Apple
- Linear
- Vercel
- Computação Espacial

Usar:

- Fundo escuro com gradientes dinâmicos
- Cards glassmorphism
- Bordas brilhantes
- Reflexos internos
- Bento grid
- Hover 3D seguindo o cursor
- Ícones flutuantes
- Animações suaves
- Tipografia Inter/SF Pro
- Visual de SaaS caro e moderno

Evitar visual genérico de template Tailwind.

## Regras de desenvolvimento
- Criar o projeto em etapas
- Começar com MVP pequeno e funcional
- Não implementar login, pagamento ou dados reais no começo
- Usar dados simulados realistas
- Não usar scraping proibido
- Preparar arquitetura para APIs oficiais no futuro
- Escrever código limpo
- Separar frontend, backend e machine learning
- Comentar partes importantes de Machine Learning para estudo