import { apiRequest } from "./api";
import type { Product } from "../types/product";
import type { SelectOption, UserProfile } from "../types/userProfile";

export type DashboardAnalytics = {
  total_products: number;
  average_margin: number;
  average_conversion: number;
  average_risk: number;
  top_niches: Array<Record<string, number | string>>;
  marketplaces: Array<Record<string, number | string>>;
  trend_series: Array<Record<string, number | string>>;
};

export type MetadataOptions = Partial<Record<keyof UserProfile, SelectOption[]>>;

export function listProducts(limit = 50) {
  return apiRequest<Product[]>(`/products?limit=${limit}`);
}

export function searchProducts(params: { marketplace?: string; niche?: string; query?: string; limit?: number }) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, String(value));
  });
  return apiRequest<Product[]>(`/products/search?${search.toString()}`);
}

export function getProduct(productId: number) {
  return apiRequest<Product>(`/products/${productId}`);
}

export function getAnalytics() {
  return apiRequest<DashboardAnalytics>("/analytics/dashboard");
}

export function getMetadataOptions() {
  return apiRequest<MetadataOptions>("/metadata/options");
}
