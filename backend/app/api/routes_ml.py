from __future__ import annotations

from fastapi import APIRouter

from app.data_providers.simulated_provider import SimulatedMarketplaceProvider
from app.ml.features import CATEGORICAL_FEATURES, NUMERIC_FEATURES, TARGET_COLUMNS
from app.ml.model_registry import get_model_registry, predict_products
from app.schemas.ml_schema import MLExplainResponse, MLMetricsResponse, MLPredictRequest, MLPredictResponse

router = APIRouter(tags=["machine-learning"])
provider = SimulatedMarketplaceProvider()


@router.post("/ml/predict", response_model=MLPredictResponse)
def predict(payload: MLPredictRequest) -> MLPredictResponse:
    products = provider.list_products()
    if payload.product_id:
        products = [product for product in products if product["product_id"] == payload.product_id]
    predictions = predict_products(products, payload.model_dump(exclude={"limit", "product_id"}), payload.limit)
    return MLPredictResponse(model_name="RandomForestRegressor MVP", predictions=predictions)


@router.get("/ml/explain", response_model=MLExplainResponse)
def explain_model() -> MLExplainResponse:
    return MLExplainResponse(
        model_name="RandomForestRegressor MVP",
        feature_groups={
            "features_numericas": NUMERIC_FEATURES,
            "features_categoricas": CATEGORICAL_FEATURES,
            "targets": TARGET_COLUMNS,
        },
        simple_explanation=(
            "Features sao as informacoes que o modelo usa para aprender. Targets sao os resultados que queremos "
            "prever, como conversao, margem, lucro, score e risco. No MVP, os targets nascem de regras de negocio "
            "e o modelo aprende a aproximar esse comportamento para criar uma base didatica."
        ),
        how_to_improve=[
            "Trocar dados simulados por dados historicos reais e autorizados.",
            "Separar treino por marketplace para capturar diferencas de taxa, entrega e conversao.",
            "Adicionar comportamento do usuario: favoritos, cliques, produtos ignorados e vendas reais.",
            "Comparar RandomForest com GradientBoosting e modelos de ranking.",
        ],
    )


@router.get("/ml/metrics", response_model=MLMetricsResponse)
def metrics() -> MLMetricsResponse:
    registry = get_model_registry(provider.list_products())
    return MLMetricsResponse(
        model_name=registry["model_name"],
        trained_rows=registry["trained_rows"],
        metrics=registry["metrics"],
        top_features=registry["top_features"],
    )

