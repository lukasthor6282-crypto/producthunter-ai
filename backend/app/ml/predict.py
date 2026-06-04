from __future__ import annotations

from app.data_providers.product_provider import get_provider
from app.ml.features import build_feature_frame
from app.ml.metrics import interpret_score, safe_percent
from app.ml.train_model import TARGET_COLUMNS, train_opportunity_model
from app.schemas.ml_schema import MLPredictionRequest, MLPredictionResponse


def predict_for_request(request: MLPredictionRequest) -> MLPredictionResponse:
    provider = get_provider()
    products = provider.list_products()
    product = provider.get_product(request.product_id) if request.product_id else None
    if product is None:
        product = next(
            (
                item
                for item in products
                if item.marketplace == request.profile.marketplace and item.niche == request.profile.niche
            ),
            products[0],
        )

    # Durante a previsao, passamos novas features para o modelo treinado.
    # O resultado e uma estimativa dos targets aprendidos no treino.
    features = build_feature_frame([product], request.profile)
    artifact = train_opportunity_model()
    prediction = artifact.model.predict(features)[0]
    values = dict(zip(TARGET_COLUMNS, prediction, strict=True))

    opportunity_score = safe_percent(float(values["opportunity_score"]))
    top_features = [item["feature"] for item in artifact.feature_importance[:3]]
    return MLPredictionResponse(
        product_id=product.id,
        product_name=product.name,
        conversion_probability=safe_percent(float(values["conversion_probability"])),
        estimated_margin=round(float(values["estimated_margin"]), 2),
        estimated_profit=round(float(values["estimated_profit"]), 2),
        opportunity_score=opportunity_score,
        risk_score=safe_percent(float(values["risk_score"])),
        model_type="MultiOutputRegressor(RandomForestRegressor)",
        interpretation=interpret_score(opportunity_score),
        top_features=top_features,
        metrics=artifact.metrics,
    )
