from __future__ import annotations

from app.data_providers.product_provider import get_provider
from app.ml.features import build_feature_frame
from app.ml.metrics import interpret_score, safe_percent
from app.ml.train_model import TARGET_COLUMNS, train_opportunity_model
from app.schemas.ml_schema import MLPredictionRequest, MLPredictionResponse
from app.schemas.product_schema import Product
from app.services.scoring_service import (
    budget_compatibility_threshold,
    calculate_investment_fit,
    calculate_opportunity_score,
    is_budget_compatible,
)


def predict_for_request(request: MLPredictionRequest) -> MLPredictionResponse:
    provider = get_provider()
    products = provider.list_products()
    product = provider.get_product(request.product_id) if request.product_id else None
    same_niche_products = [item for item in products if item.niche == request.profile.niche]

    threshold = budget_compatibility_threshold(request.profile)
    product_is_compatible = (
        product is not None
        and product.niche == request.profile.niche
        and calculate_investment_fit(product, request.profile) >= threshold
        and is_budget_compatible(product, request.profile)
    )

    if not product_is_compatible:
        product = _select_profile_product(same_niche_products, request, threshold)

    if product is None:
        raise ValueError("Nenhum produto encontrado no nicho informado para a analise de ML.")

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


def _select_profile_product(
    products: list[Product],
    request: MLPredictionRequest,
    threshold: float,
) -> Product | None:
    if not products:
        return None

    scored_products: list[tuple[bool, bool, float, Product]] = []
    for product in products:
        investment_fit = calculate_investment_fit(product, request.profile)
        budget_compatible = is_budget_compatible(product, request.profile)
        if investment_fit < threshold or not budget_compatible:
            continue
        score, _ = calculate_opportunity_score(product, request.profile)
        scored_products.append(
            (
                product.marketplace == request.profile.marketplace,
                True,
                score,
                product,
            )
        )

    if not scored_products:
        return None

    scored_products.sort(key=lambda item: item[:3], reverse=True)
    return scored_products[0][3]
