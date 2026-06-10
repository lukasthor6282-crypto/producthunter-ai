import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSecuritySessions, revokeOtherSecuritySessions, revokeSecuritySession } from "../services/authApi";

export function useSecuritySessions(enabled = true) {
  const queryClient = useQueryClient();
  const sessionsQuery = useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: getSecuritySessions,
    enabled,
    staleTime: 1000 * 30,
    retry: 1,
  });

  const invalidateSecurityData = () => {
    void queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
    void queryClient.invalidateQueries({ queryKey: ["auth", "security-events"] });
  };

  const revokeSessionMutation = useMutation({
    mutationFn: revokeSecuritySession,
    onSuccess: invalidateSecurityData,
  });

  const revokeOtherSessionsMutation = useMutation({
    mutationFn: revokeOtherSecuritySessions,
    onSuccess: invalidateSecurityData,
  });

  const queryError = sessionsQuery.error instanceof Error ? sessionsQuery.error.message : null;
  const revokeError = revokeSessionMutation.error instanceof Error ? revokeSessionMutation.error.message : null;
  const revokeOthersError = revokeOtherSessionsMutation.error instanceof Error ? revokeOtherSessionsMutation.error.message : null;

  return {
    sessions: sessionsQuery.data?.items ?? [],
    isLoading: sessionsQuery.isLoading,
    isFetching: sessionsQuery.isFetching,
    error: queryError ?? revokeError ?? revokeOthersError,
    refetch: sessionsQuery.refetch,
    revokeSession: revokeSessionMutation.mutateAsync,
    revokeOtherSessions: revokeOtherSessionsMutation.mutateAsync,
    revokingSessionId: revokeSessionMutation.isPending ? (revokeSessionMutation.variables ?? null) : null,
    isRevokingOtherSessions: revokeOtherSessionsMutation.isPending,
  };
}
