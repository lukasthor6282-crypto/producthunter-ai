import type { RecommendedProduct } from './product'
import type { UserProfile } from './userProfile'

export interface RecommendationResponse {
  profile: UserProfile
  narrative: string
  recommended_products: RecommendedProduct[]
}

export interface ProfitSimulationPayload {
  selling_price: number
  product_cost: number
  marketplace_fee_percent: number
  shipping_cost: number
  packaging_cost: number
  tax_percent: number
  affiliate_commission_percent: number
  expected_monthly_sales: number
  monthly_fixed_cost: number
}

export interface ProfitSimulationResult {
  revenue_per_unit: number
  total_cost_per_unit: number
  profit_per_unit: number
  net_margin: number
  monthly_profit_estimate: number
  break_even_units: number
  recommendation: string
}

