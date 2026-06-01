from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.ml.features import FEATURE_COLUMNS
from app.ml.predict import predict_for_request
from app.ml.train_model import train_opportunity_model
from app.models.auth_models import User
from app.schemas.ml_schema import MLPredictionRequest, MLPredictionResponse

router = APIRouter(tags=["machine-learning"])


@router.post("/ml/predict", response_model=MLPredictionResponse)
def predict(
    request: MLPredictionRequest,
    _: User = Depends(get_current_user),
) -> MLPredictionResponse:
    return predict_for_request(request)


@router.get("/ml/explain")
def explain_ml(_: User = Depends(get_current_user)) -> dict:
    artifact = train_opportunity_model()
    return {
        "model": {
            "name": "MultiOutputRegressor + RandomForestRegressor",
            "library": "Scikit-learn",
            "purpose": "Prever conversao, margem, lucro, oportunidade e risco a partir de produtos simulados.",
        },
        "dataset": artifact.dataset_summary,
        "features": {
            "total": len(FEATURE_COLUMNS),
            "definition": (
                "Features sao as variaveis de entrada usadas pelo modelo, como preco, custo, "
                "concorrencia, busca, tendencia, prazo de entrega e sinais do perfil do usuario."
            ),
            "examples": FEATURE_COLUMNS[:12],
        },
        "targets": {
            "definition": (
                "Target e a resposta que queremos ensinar o modelo a prever. No MVP, os targets "
                "sao gerados pelas regras explicaveis do motor de recomendacao."
            ),
            "items": artifact.target_descriptions,
        },
        "training": {
            "split": "75% treino / 25% teste",
            "why_split": (
                "A divisao treino/teste mede se o modelo aprendeu padroes ou apenas decorou os dados. "
                "O conjunto de teste simula produtos e perfis ainda nao vistos."
            ),
            "overfitting": (
                "Overfitting acontece quando o modelo performa muito bem no treino e mal no teste. "
                "No relatorio, olhe o overfitting_gap: quanto menor, mais saudavel."
            ),
        },
        "metrics": {
            "how_to_read": (
                "MAE e RMSE medem erro; menor e melhor. R2 mede explicacao dos dados; mais perto de 1 "
                "e melhor. Um gap alto entre train_r2 e test_r2 sugere overfitting."
            ),
            "by_target": artifact.metrics,
        },
        "feature_importance": {
            "definition": (
                "Importancia das variaveis mostra quais sinais o Random Forest mais usou. "
                "Nao prova causalidade, mas ajuda a interpretar o comportamento do modelo."
            ),
            "top": artifact.feature_importance,
        },
        "future_improvements": [
            "Substituir targets simulados por historico real de cliques, vendas e devolucoes.",
            "Treinar modelos separados por marketplace quando houver volume suficiente.",
            "Criar validacao temporal para evitar treinar com dados futuros.",
            "Comparar Random Forest com Gradient Boosting e modelos lineares interpretaveis.",
            "Monitorar drift quando precos, demanda ou concorrencia mudarem.",
        ],
    }
