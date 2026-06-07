import { useQuery } from "@tanstack/react-query";

import { getRecommendationUsage } from "../services/recommendationApi";

export function useRecommendationUsage() {
  const query = useQuery({
    queryKey: ["recommendations", "usage"],
    queryFn: getRecommendationUsage,
    staleTime: 1000 * 30,
  });

  return {
    usage: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
