import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  clearStoredAuthSession,
  storeAuthSession,
} from "../services/authToken";
import {
  getAuthConfig,
  getCurrentSession,
  loginWithGoogleCredential,
  logoutSession,
} from "../services/authApi";

const authSessionKey = ["auth", "session"] as const;

export function useAuth() {
  const queryClient = useQueryClient();

  const clearSession = useCallback(() => {
    clearStoredAuthSession();
    queryClient.setQueryData(authSessionKey, null);
    queryClient.removeQueries({ queryKey: ["analytics"] });
    queryClient.removeQueries({ queryKey: ["auth", "security-events"] });
    queryClient.removeQueries({ queryKey: ["billing", "subscription"] });
    queryClient.removeQueries({ queryKey: ["ml"] });
    queryClient.removeQueries({ queryKey: ["profit"] });
    queryClient.removeQueries({ queryKey: ["recommendations"] });
  }, [queryClient]);

  const configQuery = useQuery({
    queryKey: ["auth", "config"],
    queryFn: getAuthConfig,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  const sessionQuery = useQuery({
    queryKey: authSessionKey,
    queryFn: getCurrentSession,
    enabled: configQuery.isSuccess,
    retry: false,
    staleTime: 1000 * 60,
  });

  const loginMutation = useMutation({
    mutationFn: loginWithGoogleCredential,
    onSuccess: (session) => {
      storeAuthSession(session);
      queryClient.setQueryData(authSessionKey, session);
      void queryClient.invalidateQueries({ queryKey: ["auth", "security-events"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutSession,
    onSuccess: () => {
      clearSession();
    },
  });

  const loginError = loginMutation.error instanceof Error ? loginMutation.error.message : null;
  const configError = configQuery.error instanceof Error ? configQuery.error.message : null;
  const sessionError = sessionQuery.error instanceof Error ? sessionQuery.error.message : null;

  return {
    authConfig: configQuery.data ?? null,
    session: sessionQuery.data ?? null,
    user: sessionQuery.data?.user ?? null,
    isAuthenticated: Boolean(sessionQuery.data?.user),
    isLoading: configQuery.isPending || sessionQuery.isLoading,
    isConfigLoading: configQuery.isPending || configQuery.isFetching,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isGoogleConfigured: Boolean(configQuery.data?.google_auth_enabled),
    retryAuthConfig: configQuery.refetch,
    loginWithGoogle: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    clearSession,
    loginError,
    configError,
    sessionError,
    error: loginError ?? configError ?? sessionError,
  };
}
