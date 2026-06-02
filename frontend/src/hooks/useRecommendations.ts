import { useCallback, useState } from 'react'
import { mockRecommendationResponse } from '../data/mockStaticData'
import { generateRecommendations } from '../services/recommendationApi'
import type { RecommendationResponse } from '../types/recommendation'
import type { UserProfile } from '../types/userProfile'

export function useRecommendations() {
  const [data, setData] = useState<RecommendationResponse>(mockRecommendationResponse)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(true)

  const generate = useCallback(async (profile: UserProfile) => {
    setLoading(true)
    setError(null)
    try {
      const response = await generateRecommendations(profile)
      setData(response)
      setUsingMockData(false)
      return response
    } catch {
      setData({ ...mockRecommendationResponse, profile })
      setUsingMockData(true)
      setError('API indisponivel agora. Mostrando dados simulados locais para manter o fluxo ativo.')
      return { ...mockRecommendationResponse, profile }
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, usingMockData, generate }
}
