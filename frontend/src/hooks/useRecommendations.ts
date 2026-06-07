import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateRecommendations } from "../services/recommendationApi";
import type { UserProfile } from "../types/userProfile";

export function useRecommendations() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (profile: UserProfile) => generateRecommendations(profile),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recommendations", "usage"] });
      void queryClient.invalidateQueries({ queryKey: ["recommendations", "history"] });
    },
  });

  return {
    data: mutation.data ?? null,
    isLoading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    rawError: mutation.error,
    run: mutation.mutateAsync,
    reset: mutation.reset,
  };
}
