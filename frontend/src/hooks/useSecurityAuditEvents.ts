import { useQuery } from "@tanstack/react-query";

import { getSecurityAuditEvents } from "../services/authApi";

export function useSecurityAuditEvents(limit = 20, enabled = true) {
  const query = useQuery({
    queryKey: ["auth", "security-events", limit],
    queryFn: () => getSecurityAuditEvents(limit),
    enabled,
    staleTime: 1000 * 30,
    retry: 1,
  });

  return {
    events: query.data?.items ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
