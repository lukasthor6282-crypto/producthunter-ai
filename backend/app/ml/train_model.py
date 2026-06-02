from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from app.ml.features import CATEGORICAL_FEATURES, NUMERIC_FEATURES, TARGET_COLUMNS, product_profile_row
from app.services.scoring_service import enrich_product


TRAINING_PROFILES = [
    {
        "operation_type": "Vendedor",
        "goal": "Maior lucro",
        "investment_range": "R$ 500 a R$ 2.000",
        "experience_level": "Iniciante",
        "traffic_type": "Marketplace",
    },
    {
        "operation_type": "Afiliado",
        "goal": "Alta conversao",
        "investment_range": "Sem estoque",
        "experience_level": "Iniciante",
        "traffic_type": "Redes sociais",
    },
    {
        "operation_type": "Dropshipping",
        "goal": "Baixo risco",
        "investment_range": "Sem estoque",
        "experience_level": "Intermediario",
        "traffic_type": "Pago",
    },
    {
        "operation_type": "Revendedor",
        "goal": "Giro rapido",
        "investment_range": "Ate R$ 500",
        "experience_level": "Iniciante",
        "traffic_type": "Organico",
    },
    {
        "operation_type": "Loja propria",
        "goal": "Ticket alto",
        "investment_range": "R$ 2.000 a R$ 5.000",
        "experience_level": "Avancado",
        "traffic_type": "Pago",
    },
]


def build_training_frame(products: list[dict[str, Any]]) -> tuple[pd.DataFrame, pd.DataFrame]:
    rows: list[dict[str, Any]] = []
    targets: list[dict[str, float]] = []
    for product in products:
        for base_profile in TRAINING_PROFILES:
            profile = {
                **base_profile,
                "marketplace": product["marketplace"],
                "niche": product["niche"],
            }
            enriched = enrich_product(product, profile)
            rows.append(product_profile_row(product, profile))
            targets.append({column: float(enriched[column]) for column in TARGET_COLUMNS})
    return pd.DataFrame(rows), pd.DataFrame(targets)


def train_model(products: list[dict[str, Any]]) -> dict[str, Any]:
    X, y = build_training_frame(products)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.22, random_state=7)
    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", StandardScaler(), NUMERIC_FEATURES),
            ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES),
        ]
    )
    regressor = MultiOutputRegressor(
        RandomForestRegressor(n_estimators=120, random_state=11, min_samples_leaf=3, n_jobs=-1)
    )
    pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", regressor)])
    pipeline.fit(X_train, y_train)
    predictions = pipeline.predict(X_test)

    metrics: dict[str, float] = {}
    for index, column in enumerate(TARGET_COLUMNS):
        metrics[f"{column}_mae"] = round(float(mean_absolute_error(y_test[column], predictions[:, index])), 4)
        metrics[f"{column}_r2"] = round(float(r2_score(y_test[column], predictions[:, index])), 4)

    feature_importances = _feature_importances(pipeline)
    return {
        "model_name": "RandomForestRegressor MVP",
        "pipeline": pipeline,
        "trained_rows": len(X),
        "metrics": metrics,
        "top_features": feature_importances[:12],
    }


def _feature_importances(pipeline: Pipeline) -> list[dict[str, str | float]]:
    preprocessor: ColumnTransformer = pipeline.named_steps["preprocessor"]
    model: MultiOutputRegressor = pipeline.named_steps["model"]
    feature_names = list(preprocessor.get_feature_names_out())
    importances = np.mean([est.feature_importances_ for est in model.estimators_], axis=0)
    ranked = sorted(zip(feature_names, importances, strict=False), key=lambda pair: pair[1], reverse=True)
    return [{"feature": name.replace("numeric__", "").replace("categorical__", ""), "importance": round(float(value), 4)} for name, value in ranked]

