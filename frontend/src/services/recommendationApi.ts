import { apiRequest } from "./api";
import type {
  MLExplanation,
  MLPrediction,
  ProfitSimulation,
  ProfitSimulationInput,
  RecommendationHistoryResponse,
  RecommendationUsage,
  RecommendationResponse,
} from "../types/recommendation";
import type { UserProfile } from "../types/userProfile";

export function generateRecommendations(profile: UserProfile, limit = 8) {
  return apiRequest<RecommendationResponse>("/recommendations/generate", {
    method: "POST",
    body: JSON.stringify({ ...profile, limit }),
  });
}

export function getRecommendationHistory(limit = 20) {
  return apiRequest<RecommendationHistoryResponse>(`/recommendations/history?limit=${limit}`);
}

export function getRecommendationUsage() {
  return apiRequest<RecommendationUsage>("/recommendations/usage");
}

export function simulateProfit(input: ProfitSimulationInput) {
  return apiRequest<ProfitSimulation>("/profit/simulate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function predictML(profile: UserProfile, productId?: number) {
  return apiRequest<MLPrediction>("/ml/predict", {
    method: "POST",
    body: JSON.stringify({ profile, product_id: productId }),
  });
}

export function explainML() {
  return apiRequest<MLExplanation>("/ml/explain");
}
