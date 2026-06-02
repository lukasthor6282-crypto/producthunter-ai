# Estrategia de Dados

## MVP

O MVP usa dados simulados realistas em `backend/app/data_providers/simulated_provider.py`.

Essa decisao permite:

- estudar ML sem depender de contratos externos
- validar fluxo de produto
- testar ranking e UI
- preparar schemas antes de dados reais

## Providers

- `simulated_provider.py`: dados fake deterministicos.
- `csv_provider.py`: carrega CSVs autorizados.
- `marketplace_provider_base.py`: interface para providers reais.

## Fontes futuras

- APIs oficiais dos marketplaces
- Programas de afiliados
- CSVs exportados pelo usuario
- Bancos proprios
- Google Trends
- Historico de precos
- Dados internos de vendas

## Limites eticos e legais

O projeto nao deve usar scraping proibido, burlar termos de uso ou coletar dados privados sem consentimento.

## Transicao para dados reais

1. Definir schema minimo por fonte.
2. Criar mapeadores para o formato interno.
3. Validar qualidade dos dados.
4. Registrar origem e data de coleta.
5. Separar dados historicos de dados de treino.
6. Medir performance das recomendacoes no mundo real.

