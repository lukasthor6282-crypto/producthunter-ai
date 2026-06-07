import { useQuery } from "@tanstack/react-query";

import { getRecommendationHistory, getRecommendationUsage } from "../services/recommendationApi";

export function useRecommendationHistory(limit = 20) {
  const historyQuery = useQuery({
    queryKey: ["recommendations", "history", limit],
    queryFn: () => getRecommendationHistory(limit),
  });

  const usageQuery = useQuery({
    queryKey: ["recommendations", "usage"],
    queryFn: getRecommendationUsage,
  });

  const historyError = historyQuery.error instanceof Error ? historyQuery.error.message : null;
  const usageError = usageQuery.error instanceof Error ? usageQuery.error.message : null;

  return {
    items: historyQuery.data?.items ?? [],
    usage: usageQuery.data ?? null,
    isLoading: historyQuery.isLoading || usageQuery.isLoading,
    isFetching: historyQuery.isFetching || usageQuery.isFetching,
    error: historyError ?? usageError,
    refetch: () => {
      void historyQuery.refetch();
      void usageQuery.refetch();
    },
  };
}
