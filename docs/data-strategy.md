# Estrategia de Dados

## Estado Atual

O MVP usa dados simulados realistas.

Isso permite:

- desenvolver sem depender de APIs externas;
- evitar scraping proibido;
- estudar recomendacao e Machine Learning;
- testar UX e fluxo de produto;
- validar a proposta antes de investir em integracoes.

## Dados Simulados

Cada produto possui campos como:

- marketplace;
- nicho;
- categoria;
- preco medio;
- preco minimo e maximo;
- custo estimado;
- taxa da plataforma;
- frete;
- embalagem;
- imposto estimado;
- comissao de afiliado;
- concorrentes;
- volume de busca;
- tendencia;
- avaliacao media;
- reviews;
- velocidade de venda;
- risco de devolucao;
- sazonalidade;
- peso;
- prazo de entrega;
- confiabilidade do fornecedor;
- apelo visual;
- potencial de kit;
- recorrencia.

## Contrato Interno

O schema `Product` e o contrato interno do sistema. Qualquer dado externo deve ser convertido para esse formato antes de entrar no motor.

Vantagens:

- o motor nao depende diretamente de uma API especifica;
- o frontend continua estavel;
- fica mais facil trocar fontes;
- cada provider pode tratar sua propria normalizacao.

## Caminho Para Dados Reais

1. Escolher um marketplace prioritario.
2. Verificar se existe API oficial.
3. Ler termos de uso e limites.
4. Criar um provider especifico.
5. Mapear campos externos para `Product`.
6. Adicionar cache e controle de rate limit.
7. Registrar origem dos dados.
8. Validar qualidade e cobertura.
9. Atualizar o modelo de ML com dados reais.

## APIs Oficiais

Priorize integracoes com:

- documentacao oficial;
- autenticação clara;
- permissao para uso comercial;
- limites de requisicao definidos;
- politicas de armazenamento compreensiveis.

Cada marketplace pode ter regras diferentes. O produto deve ser desenhado para aceitar diferencas de disponibilidade entre plataformas.

## Cuidados Com Scraping

Scraping pode violar termos de uso, gerar bloqueios ou criar risco juridico.

Antes de qualquer coleta:

- leia os termos da plataforma;
- verifique `robots.txt` quando aplicavel;
- evite contornar bloqueios;
- nao colete dados pessoais sem base legal;
- respeite limites de acesso;
- registre a origem dos dados;
- prefira APIs oficiais.

## Privacidade

O MVP nao precisa coletar dados pessoais sensiveis.

Quando houver login:

- colete apenas o necessario;
- documente finalidade;
- permita exclusao de conta;
- proteja credenciais de APIs;
- use logs sem dados sensiveis;
- avalie requisitos de LGPD.

## Qualidade Dos Dados

Dados ruins geram recomendacoes ruins.

Indicadores importantes:

- data da ultima atualizacao;
- marketplace de origem;
- confiabilidade da fonte;
- cobertura por nicho;
- campos ausentes;
- outliers de preco;
- duplicidade de produtos;
- mudancas bruscas de demanda.

## Dados Para Machine Learning Futuro

Para treinar um modelo melhor, o sistema deve coletar historico de:

- produtos recomendados;
- posicao no ranking;
- clique do usuario;
- produto salvo;
- venda gerada;
- margem real;
- custo real de trafego;
- devolucao;
- tempo ate primeira venda;
- canal de aquisicao.

Esses dados permitiriam substituir targets simulados por resultados reais.

## Governanca

Recomendacao:

- manter tabela de fontes;
- versionar schema de produto;
- registrar transformacoes;
- separar dado bruto e dado normalizado;
- criar monitoramento de falhas de coleta;
- revisar legalmente novas fontes antes de ativar em producao.
