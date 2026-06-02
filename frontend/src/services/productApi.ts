import { apiRequest } from './api'
import type { DashboardData, Product } from '../types/product'

interface ProductListResponse {
  total: number
  products: Product[]
}

export function getDashboard(): Promise<DashboardData> {
  return apiRequest<DashboardData>('/analytics/dashboard')
}

export function getProducts(limit = 80): Promise<ProductListResponse> {
  return apiRequest<ProductListResponse>(`/products?limit=${limit}`)
}

