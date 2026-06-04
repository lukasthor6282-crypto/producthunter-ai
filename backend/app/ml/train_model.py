from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from math import sqrt

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from app.data_providers.product_provider import get_provider
from app.ml.features import FEATURE_COLUMNS, build_feature_frame
from app.schemas.profile_schema import UserProfile
from app.services.profit_service import calculate_product_profit
from app.services.scoring_service import (
    calculate_conversion_probability,
    calculate_opportunity_score,
    calculate_risk_score,
)
from app.utils.constants import GOALS, MARKETPLACES, NICHES, OPERATION_TYPES, TRAFFIC_TYPES

TARGET_COLUMNS = [
    "conversion_probability",
    "estimated_margin",
    "estimated_profit",
    "opportunity_score",
    "risk_score",
]


@dataclass(frozen=True)
class MLTrainingArtifact:
    model: Pipeline
    metrics: dict[str, dict[str, float]]
    feature_importance: list[dict[str, float | str]]
    dataset_summary: dict[str, int | float]
    target_descriptions: dict[str, str]


def build_training_profiles() -> list[UserProfile]:
    """Cria varios perfis simulados para ensinar o modelo.

    Dados reais teriam historico de vendas, cliques e pedidos. Como o MVP usa
    dados simulados, variamos operacao, marketplace, nicho, objetivo e trafego
    para gerar exemplos diferentes. Isso ajuda o modelo a aprender que o mesmo
    produto pode ser bom para um perfil e mediano para outro.
    """
    operations = [item["value"] for item in OPERATION_TYPES]
    marketplaces = [item["value"] for item in MARKETPLACES]
    niches = [item["value"] for item in NICHES]
    goals = [item["value"] for item in GOALS]
    traffic_types = [item["value"] for item in TRAFFIC_TYPES]
    experience_levels = ["beginner", "intermediate", "advanced"]
    investment_ranges = ["up_to_500", "500_to_2000", "2000_to_5000", "5000_plus"]

    profiles: list[UserProfile] = []
    for index, marketplace in enumerate(marketplaces):
        for niche_index, niche in enumerate(niches):
            profiles.append(
                UserProfile(
                    operation_type=operations[(index + niche_index) % len(operations)],
                    marketplace=marketplace,
                    niche=niche,
                    goal=goals[(index * 2 + niche_index) % len(goals)],
                    investment_range=investment_ranges[(index + niche_index) % len(investment_ranges)],
                    experience_level=experience_levels[(index + niche_index) % len(experience_levels)],
                    traffic_type=traffic_types[(index + niche_index * 2) % len(traffic_types)],
                )
            )
    return profiles


def build_target_frame(products, profile: UserProfile) -> pd.DataFrame:
    """Monta os targets, ou seja, aquilo que o modelo deve prever.

    Target e a resposta correta usada no treino. No futuro, esses targets
    devem vir de resultados reais: conversao observada, lucro real e vendas.
    No MVP, usamos as formulas explicaveis do motor de recomendacao como
    "professor" para treinar o Random Forest.
    """
    targets = []
    for product in products:
        profit = calculate_product_profit(product)
        opportunity_score, _ = calculate_opportunity_score(product, profile)
        targets.append(
            {
                "conversion_probability": calculate_conversion_probability(product),
                "estimated_margin": profit.margin_percent,
                "estimated_profit": profit.unit_profit,
                "opportunity_score": opportunity_score,
                "risk_score": calculate_risk_score(product, profile),
            }
        )
    return pd.DataFrame(targets)[TARGET_COLUMNS]


def build_training_dataset() -> tuple[pd.DataFrame, pd.DataFrame, dict[str, int | float]]:
    products = get_provider().list_products()
    profiles = build_training_profiles()
    feature_frames = []
    target_frames = []

    for profile in profiles:
        feature_frames.append(build_feature_frame(products, profile))
        target_frames.append(build_target_frame(products, profile))

    features = pd.concat(feature_frames, ignore_index=True)
    targets = pd.concat(target_frames, ignore_index=True)
    summary = {
        "products": len(products),
        "profiles": len(profiles),
        "rows": len(features),
        "features": len(FEATURE_COLUMNS),
        "targets": len(TARGET_COLUMNS),
    }
    return features, targets, summary


def calculate_metrics(
    y_train: pd.DataFrame,
    train_prediction: np.ndarray,
    y_test: pd.DataFrame,
    test_prediction: np.ndarray,
) -> dict[str, dict[str, float]]:
    """Calcula metricas para saber se o modelo generaliza.

    Dividimos treino e teste para medir o modelo em dados que ele ainda nao
    viu. Se o erro no treino fica muito baixo e o erro no teste fica alto, isso
    indica overfitting: o modelo decorou os exemplos em vez de aprender padroes.

    MAE mostra o erro medio na unidade do target. RMSE pune erros grandes com
    mais forca. R2 vai de negativo a 1; quanto mais perto de 1, melhor a
    explicacao da variacao dos dados.
    """
    metrics: dict[str, dict[str, float]] = {}
    for index, target in enumerate(TARGET_COLUMNS):
        train_mae = mean_absolute_error(y_train[target], train_prediction[:, index])
        test_mae = mean_absolute_error(y_test[target], test_prediction[:, index])
        test_rmse = sqrt(mean_squared_error(y_test[target], test_prediction[:, index]))
        train_r2 = r2_score(y_train[target], train_prediction[:, index])
        test_r2 = r2_score(y_test[target], test_prediction[:, index])
        metrics[target] = {
            "train_mae": round(float(train_mae), 2),
            "test_mae": round(float(test_mae), 2),
            "test_rmse": round(float(test_rmse), 2),
            "train_r2": round(float(train_r2), 3),
            "test_r2": round(float(test_r2), 3),
            "overfitting_gap": round(float(train_r2 - test_r2), 3),
        }
    return metrics


def calculate_feature_importance(model: Pipeline) -> list[dict[str, float | str]]:
    """Extrai importancia das variaveis do Random Forest.

    Importancia mostra quais features foram mais usadas pelas arvores para
    reduzir erro. Ela nao prova causalidade, mas ajuda a entender quais sinais
    mais influenciaram as previsoes neste dataset simulado.
    """
    regressor = model.named_steps["regressor"]
    importances = np.mean(
        [estimator.feature_importances_ for estimator in regressor.estimators_],
        axis=0,
    )
    ranked = sorted(
        zip(FEATURE_COLUMNS, importances, strict=True),
        key=lambda item: item[1],
        reverse=True,
    )
    return [
        {"feature": feature, "importance": round(float(importance), 4)}
        for feature, importance in ranked[:12]
    ]


@lru_cache(maxsize=1)
def train_opportunity_model() -> MLTrainingArtifact:
    features, targets, dataset_summary = build_training_dataset()

    # O split separa uma parte dos dados para treino e outra para teste.
    # O modelo so aprende com x_train/y_train. Depois medimos em x_test/y_test
    # para simular como ele se comportaria com exemplos novos.
    x_train, x_test, y_train, y_test = train_test_split(
        features,
        targets,
        test_size=0.25,
        random_state=2026,
        shuffle=True,
    )

    # Pipeline:
    # 1. StandardScaler coloca variaveis numericas em escalas comparaveis.
    # 2. MultiOutputRegressor treina um regressor por target.
    # 3. RandomForest aprende relacoes nao lineares e lida bem com features
    #    misturadas, como preco, concorrencia e one-hot encoding.
    model = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "regressor",
                MultiOutputRegressor(
                    RandomForestRegressor(
                        n_estimators=140,
                        max_depth=10,
                        min_samples_leaf=2,
                        random_state=2026,
                        n_jobs=-1,
                    )
                ),
            ),
        ]
    )
    model.fit(x_train, y_train)

    train_prediction = model.predict(x_train)
    test_prediction = model.predict(x_test)
    metrics = calculate_metrics(y_train, train_prediction, y_test, test_prediction)

    return MLTrainingArtifact(
        model=model,
        metrics=metrics,
        feature_importance=calculate_feature_importance(model),
        dataset_summary=dataset_summary,
        target_descriptions={
            "conversion_probability": "Probabilidade estimada de o produto converter para o perfil.",
            "estimated_margin": "Margem liquida estimada por unidade.",
            "estimated_profit": "Lucro liquido estimado por unidade.",
            "opportunity_score": "Score final de oportunidade usado para priorizar produtos.",
            "risk_score": "Risco operacional estimado; quanto menor, melhor.",
        },
    )
