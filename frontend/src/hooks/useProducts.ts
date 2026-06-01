import { useQuery } from "@tanstack/react-query";
import { getAnalytics, listProducts, searchProducts } from "../services/productApi";

export function useProducts(limit = 30) {
  const query = useQuery({
    queryKey: ["products", limit],
    queryFn: () => listProducts(limit),
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
  });

  return {
    analytics: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
