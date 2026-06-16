import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminOverview,
  getAdminUsers,
  updateAdminUser,
  type AdminUserUpdate,
} from "../services/adminApi";

export function useAdminOverview(enabled = true) {
  const query = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: getAdminOverview,
    enabled,
    staleTime: 1000 * 30,
  });

  return {
    overview: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}

export function useAdminUsers(enabled = true) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    enabled,
    staleTime: 1000 * 30,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: number; payload: AdminUserUpdate }) => updateAdminUser(userId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  return {
    users: query.data?.items ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
    updateUser: updateUserMutation.mutateAsync,
    updatingUserId: updateUserMutation.isPending ? (updateUserMutation.variables?.userId ?? null) : null,
    updateError: updateUserMutation.error instanceof Error ? updateUserMutation.error.message : null,
  };
}
