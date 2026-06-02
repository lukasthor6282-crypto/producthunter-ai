# Guia de Machine Learning

## O que e Machine Learning

Machine Learning e uma forma de criar sistemas que aprendem padroes a partir de dados. Em vez de escrever todas as regras manualmente, voce entrega exemplos ao modelo e ele aprende uma funcao aproximada.

## O que e um sistema de recomendacao

Um recomendador ordena opcoes para uma pessoa ou contexto. No ProductHunter AI, ele ordena produtos para um perfil de vendedor ou afiliado.

## Features

Features sao as entradas do modelo. Exemplos:

- preco medio
- custo estimado
- taxa do marketplace
- frete
- concorrentes
- volume de busca
- tendencia
- avaliacao
- reviews
- risco de devolucao
- marketplace
- nicho
- tipo de operacao

## Target

Target e o que queremos prever. No MVP:

- probabilidade de conversao
- margem estimada
- lucro estimado
- score de oportunidade
- score de risco

## Como o modelo aprende

1. O provider gera produtos simulados.
2. As regras calculam targets iniciais.
3. O pipeline transforma features numericas e categoricas.
4. O `RandomForestRegressor` aprende a aproximar os targets.
5. As metricas mostram o erro medio e o R2.

## Como interpretar

Se uma feature aparece com alta importancia, ela ajudou muito o modelo a tomar decisoes. Isso nao prova causalidade; apenas indica influencia no conjunto de treino.

## Como melhorar

- Usar dados reais autorizados
- Separar modelos por marketplace
- Adicionar historico temporal
- Medir vendas reais
- Aprender com favoritos e cliques
- Testar Gradient Boosting e modelos de ranking

