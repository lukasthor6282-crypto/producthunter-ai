# Design System

## Direcao Visual

O ProductHunter AI deve parecer um SaaS premium de inteligencia comercial.

Referencias:

- Claude Design;
- Apple;
- Linear;
- Vercel;
- computacao espacial.

O objetivo visual e transmitir:

- confianca;
- tecnologia;
- clareza;
- produto caro;
- foco em decisao de negocio.

## Principios

- Interface escura, elegante e legivel.
- Cards com glassmorphism e bordas sutis.
- Contraste forte para dados importantes.
- Microinteracoes suaves.
- Graficos claros, sem excesso decorativo.
- Layout responsivo.
- Componentes reutilizaveis.

## Paleta

Base:

- fundo quase preto;
- superficies escuras translucidas;
- bordas brancas com baixa opacidade.

Acentos:

- `electric`: azul/ciano para IA e tecnologia;
- `mint`: verde para oportunidade, lucro e sinais positivos;
- `ember`: laranja para conversao, alerta ou energia;
- violeta suave para risco, insight ou destaque secundario.

Uso recomendado:

- mint para lucro, margem e oportunidade;
- electric para IA, loading e botoes principais;
- ember para alertas e conversao;
- branco para titulos;
- cinza claro para texto secundario.

## Tipografia

Fonte principal:

- Inter;
- fallback estilo SF Pro.

Regras:

- titulos fortes e curtos;
- labels pequenas em uppercase quando forem metricas;
- texto de apoio com boa altura de linha;
- evitar blocos longos dentro de cards operacionais.

## Componentes

### GlassCard

Card base do produto.

Uso:

- metricas;
- paineis;
- blocos de dashboard;
- laboratorio de IA;
- simulador.

Caracteristicas:

- fundo translucido;
- blur;
- borda clara sutil;
- reflexo interno;
- raio moderado.

### GlowButton

Botao de acao principal ou secundaria.

Uso:

- gerar recomendacao;
- rodar modelo;
- iniciar demo.

Caracteristicas:

- glow sutil;
- animacao no hover;
- feedback no tap;
- alto contraste.

### Sidebar

Navegacao principal.

Regras:

- fixa no desktop;
- compacta no mobile;
- icones Lucide;
- estado ativo claro;
- labels visiveis no desktop.

### Header

Topo de cada tela.

Deve conter:

- categoria pequena;
- titulo;
- subtitulo curto;
- indicadores de status quando fizer sentido.

### ProductOpportunityCard

Card de produto recomendado.

Deve destacar:

- nome do produto;
- score;
- margem;
- lucro;
- risco;
- marketplace;
- nicho.

## Telas

### Landing Page

Deve vender a promessa central rapidamente:

> Encontre o produto certo para o seu perfil.

Primeira dobra deve parecer produto real, nao template generico.

### Dashboard

Deve ser denso o suficiente para analise, mas ainda premium.

Elementos:

- KPIs;
- grafico de tendencia;
- nichos;
- produtos em destaque.

### Perfil de Recomendacao

Formulario claro, com controles previsiveis.

Regras:

- grupos de campos bem separados;
- labels diretas;
- CTA evidente;
- loading da IA quando gerar ranking.

### Resultado

Deve priorizar decisao:

- ranking;
- score;
- explicacao;
- estrategia;
- fatores positivos;
- alertas.

### Laboratorio de IA

Deve ensinar sem parecer aula pesada.

Elementos:

- dataset;
- features;
- targets;
- metricas;
- importancia das variaveis;
- previsao do modelo.

## Animacoes

Use Framer Motion para:

- entrada suave de telas;
- hover de botoes;
- loading da IA;
- cards;
- transicoes de estado.

Evite:

- animacoes longas demais;
- elementos competindo com dados;
- excesso de movimento em telas analiticas.

## Responsividade

Desktop:

- sidebar fixa;
- grids com duas ou tres colunas;
- graficos maiores.

Mobile:

- navegacao inferior;
- cards empilhados;
- botoes com area de toque confortavel;
- graficos com altura controlada;
- texto sem sobreposicao.

## Acessibilidade

Recomendacoes:

- manter contraste minimo;
- usar `aria-label` em botoes iconicos;
- nao depender apenas de cor para risco;
- preservar foco de teclado;
- evitar fontes pequenas em informacoes importantes.

## Evitar

- visual generico de template Tailwind;
- cards aninhados em excesso;
- hero dividido artificialmente;
- gradientes dominando toda a tela;
- textos grandes dentro de componentes compactos;
- excesso de badges sem funcao.
