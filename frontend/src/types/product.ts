export interface Product {
  product_id: string
  product_name: string
  marketplace: string
  niche: string
  category: string
  average_price: number
  min_price: number
  max_price: number
  estimated_cost: number
  marketplace_fee_percent: number
  shipping_cost: number
  packaging_cost: number
  estimated_tax_percent: number
  affiliate_commission_percent: number
  competitor_count: number
  search_volume: number
  trend_score: number
  rating_average: number
  review_count: number
  sales_velocity: number
  return_risk: number
  seasonality_score: number
  product_weight: number
  supplier_reliability: number
  delivery_time_days: number
}

export interface RecommendedProduct extends Product {
  opportunity_score: number
  estimated_margin: number
  estimated_profit: number
  conversion_probability: number
  competition_level: string
  risk_score: number
  best_for: string
  recommended_strategy: string
  target_audience: string
  recommendation_reason: string
  affiliate_earning: number
}

export interface DashboardData {
  market_score: number
  opportunities_today: RecommendedProduct[]
  trending_products: RecommendedProduct[]
  heated_niches: Array<{ niche: string; score: number }>
  best_margin_products: RecommendedProduct[]
  low_competition_products: RecommendedProduct[]
  high_conversion_products: RecommendedProduct[]
  trend_alerts: string[]
}

