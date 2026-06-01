# Guia de Aprendizado de Machine Learning

Este guia explica como o Machine Learning do ProductHunter AI funciona no MVP e como ele pode evoluir.

## Objetivo do ML

O modelo tenta prever cinco resultados para um produto dentro de um perfil:

- `conversion_probability`: chance estimada de conversao.
- `estimated_margin`: margem liquida estimada.
- `estimated_profit`: lucro unitario estimado.
- `opportunity_score`: score de oportunidade.
- `risk_score`: score de risco.

## Onde Esta o Codigo

```text
backend/app/ml/
  features.py       Prepara as features
  train_model.py    Monta dataset, treina modelo e calcula metricas
  predict.py        Faz previsoes para a API
  metrics.py        Interpreta scores e protege percentuais
```

## O Que Sao Features

Features sao as variaveis de entrada usadas pelo modelo para aprender padroes.

Exemplos no ProductHunter AI:

- preco medio;
- custo estimado;
- spread entre preco e custo;
- taxa da plataforma;
- frete;
- quantidade de concorrentes;
- volume de busca;
- tendencia;
- velocidade de venda;
- risco de devolucao;
- confiabilidade do fornecedor;
- tipo de operacao;
- objetivo do usuario;
- marketplace;
- nicho;
- tipo de trafego.

Categorias como marketplace e objetivo viram colunas numericas por one-hot encoding. Por exemplo, se o marketplace e Shopee, a coluna `marketplace_shopee` recebe `1` e as outras recebem `0`.

## O Que E Target

Target e a resposta que o modelo aprende a prever.

No MVP, ainda nao existem dados reais de vendas, cliques e conversoes. Por isso, os targets sao gerados pelas regras explicaveis do motor de recomendacao. Isso cria um "professor" inicial para o modelo.

No futuro, os targets ideais seriam:

- conversao real observada;
- margem real por pedido;
- lucro real por SKU;
- taxa real de devolucao;
- vendas por canal;
- CAC ou custo por venda;
- tempo ate primeira venda.

## Preparacao Dos Dados

O pipeline cria combinacoes entre produtos simulados e perfis simulados.

Exemplo:

- 420 produtos;
- 105 perfis;
- 44.100 linhas de treino;
- 74 features;
- 5 targets.

Cada linha representa:

```text
produto + perfil -> targets esperados
```

## Por Que Dividir Treino e Teste

O modelo precisa ser avaliado em exemplos que nao viu durante o treino.

Por isso usamos:

- 75% dos dados para treino;
- 25% dos dados para teste.

Se o modelo vai bem no treino e mal no teste, ele provavelmente decorou os exemplos. Isso se chama overfitting.

## O Que E Overfitting

Overfitting acontece quando o modelo aprende detalhes demais dos dados de treino e perde capacidade de generalizar.

Exemplo simples:

- treino: R2 = 0.99;
- teste: R2 = 0.40.

Isso sugere que o modelo performa bem nos exemplos conhecidos, mas falha em exemplos novos.

No ProductHunter AI, o Laboratorio de IA mostra `overfitting_gap`, que e a diferenca entre `train_r2` e `test_r2`. Quanto menor, melhor.

## Modelo Usado

O MVP usa:

- Scikit-learn;
- `RandomForestRegressor`;
- `MultiOutputRegressor`;
- `StandardScaler`;
- `Pipeline`.

### Por Que Random Forest

Random Forest e uma boa escolha inicial porque:

- lida bem com relacoes nao lineares;
- funciona bem com muitos tipos de features;
- exige menos preparacao que alguns modelos;
- fornece importancia das variaveis;
- e facil de explicar para estudo.

### Por Que MultiOutputRegressor

O sistema precisa prever cinco targets ao mesmo tempo. O `MultiOutputRegressor` treina um regressor para cada target usando a mesma matriz de features.

## Metricas

### MAE

Erro absoluto medio. Quanto menor, melhor.

Se `MAE` do score de oportunidade e `2.1`, significa que o erro medio esta perto de 2 pontos de score.

### RMSE

Raiz do erro quadratico medio. Tambem quanto menor, melhor. Penaliza erros grandes com mais forca.

### R2

Mostra quanto da variacao dos dados o modelo consegue explicar.

- perto de 1: melhor;
- perto de 0: fraco;
- negativo: pior que uma previsao simples pela media.

## Importancia Das Variaveis

O Random Forest calcula quais features mais ajudaram a reduzir erro nas arvores.

Isso nao prova causalidade. Uma feature importante nao significa necessariamente que ela causa o resultado, mas indica que o modelo a usou bastante para prever.

Exemplos comuns:

- `gross_spread`;
- `price_to_cost_ratio`;
- `sales_velocity`;
- `return_risk`;
- `investment_fit`;
- `trend_score`.

## Como Melhorar Futuramente

1. Substituir targets simulados por dados reais.
2. Separar treino por marketplace quando houver volume.
3. Adicionar dados temporais para capturar tendencia.
4. Criar validacao temporal, evitando treinar com dados futuros.
5. Comparar Random Forest com Gradient Boosting.
6. Salvar modelos treinados em arquivo.
7. Criar monitoramento de drift.
8. Medir recomendacao contra vendas reais.

## Como Estudar Pelo Projeto

Ordem sugerida:

1. Leia `features.py` para entender entradas.
2. Leia `train_model.py` para entender dataset, targets e metricas.
3. Leia `predict.py` para entender previsao.
4. Abra `/ml/explain` para ver o relatorio.
5. Use a tela Laboratorio de IA no frontend.
