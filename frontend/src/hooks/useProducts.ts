import { useQuery } from "@tanstack/react-query";
import { getAnalytics, listProducts, searchProducts } from "../services/productApi";

export function useProducts(limit = 30) {
  const query = useQuery({
    queryKey: ["products", limit],
    queryFn: () => listProducts(limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 20,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export function useProductSearch(params: { marketplace?: string; niche?: string; query?: string; limit?: number }) {
  const query = useQuery({
    queryKey: ["products", "search", params],
    queryFn: () => searchProducts(params),
    staleTime: 1000 * 60 * 2,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export function useDashboardAnalytics() {
  const query = useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: getAnalytics,
    staleTime: 1000 * 60 * 5,
  });

  return {
    analytics: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
