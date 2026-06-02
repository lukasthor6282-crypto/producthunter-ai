import { useMutation } from "@tanstack/react-query";
import { generateRecommendations } from "../services/recommendationApi";
import type { UserProfile } from "../types/userProfile";

export function useRecommendations() {
  const mutation = useMutation({
    mutationFn: (profile: UserProfile) => generateRecommendations(profile),
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
