import { useQuery } from "@tanstack/react-query";

import { getRecommendationHistory, getRecommendationInsights, getRecommendationUsage } from "../services/recommendationApi";

export function useRecommendationHistory(limit = 20) {
  const historyQuery = useQuery({
    queryKey: ["recommendations", "history", limit],
    queryFn: () => getRecommendationHistory(limit),
    staleTime: 1000 * 60,
  });

  const usageQuery = useQuery({
    queryKey: ["recommendations", "usage"],
    queryFn: getRecommendationUsage,
    staleTime: 1000 * 30,
  });
  const insightsQuery = useQuery({
    queryKey: ["recommendations", "insights", 5],
    queryFn: () => getRecommendationInsights(5),
    staleTime: 1000 * 60,
  });

  const historyError = historyQuery.error instanceof Error ? historyQuery.error.message : null;
  const usageError = usageQuery.error instanceof Error ? usageQuery.error.message : null;
  const insightsError = insightsQuery.error instanceof Error ? insightsQuery.error.message : null;

  return {
    items: historyQuery.data?.items ?? [],
    usage: usageQuery.data ?? null,
    insights: insightsQuery.data ?? null,
    isLoading: historyQuery.isLoading,
    isFetching: historyQuery.isFetching || usageQuery.isFetching || insightsQuery.isFetching,
    error: historyError ?? usageError ?? insightsError,
    refetch: () => {
      void historyQuery.refetch();
      void usageQuery.refetch();
      void insightsQuery.refetch();
    },
  };
}
