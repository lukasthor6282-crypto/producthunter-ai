import type { Product } from "./product";
import type { UserProfile } from "./userProfile";

export type RecommendationItem = {
  product: Product;
  opportunity_score: number;
  estimated_margin_percent: number;
  estimated_profit: number;
  conversion_probability: number;
  competition_score: number;
  risk_score: number;
  recommended_strategy: string;
  target_audience: string;
  explanation: string;
  score_breakdown: Record<string, number>;
  decision_factors?: string[];
  warnings?: string[];
};

export type RecommendationResponse = {
  profile: UserProfile;
  total_candidates: number;
  recommendations: RecommendationItem[];
  applied_filters?: Record<string, string | number | boolean | null>;
  message?: string;
};

export type ProfitSimulation = {
  product_id?: number;
  unit_revenue: number;
  unit_cost: number;
  unit_profit: number;
  margin_percent: number;
  monthly_profit: number;
  breakeven_units: number;
  platform_fee_value: number;
  tax_value: number;
  shipping_value?: number;
  packaging_value?: number;
  ad_cost_per_unit?: number;
  fixed_monthly_cost?: number;
  gross_monthly_profit?: number;
  net_monthly_profit?: number;
  roi_percent?: number;
  contribution_margin_percent?: number;
};

export type ProfitSimulationInput = {
  product_id: number;
  monthly_units: number;
  ad_cost_per_unit?: number;
  fixed_monthly_cost?: number;
};

export type MLPrediction = {
  product_id: number;
  product_name: string;
  conversion_probability: number;
  estimated_margin: number;
  estimated_profit: number;
  opportunity_score: number;
  risk_score: number;
  model_type: string;
  interpretation: string;
  top_features: string[];
  metrics: Record<string, MLMetric>;
};

export type MLMetric = {
  train_mae: number;
  test_mae: number;
  test_rmse: number;
  train_r2: number;
  test_r2: number;
  overfitting_gap: number;
};

export type MLFeatureImportance = {
  feature: string;
  importance: number;
};

export type MLExplanation = {
  model: {
    name: string;
    library: string;
    purpose: string;
  };
  dataset: {
    products: number;
    profiles: number;
    rows: number;
    features: number;
    targets: number;
  };
  features: {
    total: number;
    definition: string;
    examples: string[];
  };
  targets: {
    definition: string;
    items: Record<string, string>;
  };
  training: {
    split: string;
    why_split: string;
    overfitting: string;
  };
  metrics: {
    how_to_read: string;
    by_target: Record<string, MLMetric>;
  };
  feature_importance: {
    definition: string;
    top: MLFeatureImportance[];
  };
  future_improvements: string[];
};
