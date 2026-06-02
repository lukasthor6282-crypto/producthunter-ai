import { apiRequest } from './api'
import type {
  ProfitSimulationPayload,
  ProfitSimulationResult,
  RecommendationResponse,
} from '../types/recommendation'
import type { UserProfile } from '../types/userProfile'

export function generateRecommendations(
  profile: UserProfile,
  limit = 8,
): Promise<RecommendationResponse> {
  return apiRequest<RecommendationResponse>('/recommendations/generate', {
    method: 'POST',
    body: JSON.stringify({ ...profile, limit }),
  })
}

export function simulateProfit(payload: ProfitSimulationPayload): Promise<ProfitSimulationResult> {
  return apiRequest<ProfitSimulationResult>('/profit/simulate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMlMetrics(): Promise<unknown> {
  return apiRequest('/ml/metrics')
}

export function getMlExplain(): Promise<unknown> {
  return apiRequest('/ml/explain')
}

