import { useMutation } from "@tanstack/react-query";
import { generateRecommendations } from "../services/recommendationApi";
import type { UserProfile } from "../types/userProfile";

export function useRecommendations() {
  const mutation = useMutation({
    mutationFn: (profile: UserProfile) => generateRecommendations(profile),
  });

  const error = mutation.error instanceof Error ? mutation.error.message : null;

  return {
    data: mutation.data ?? null,
    isLoading: mutation.isPending,
    error,
    run: mutation.mutateAsync,
    reset: mutation.reset,
  };
}
