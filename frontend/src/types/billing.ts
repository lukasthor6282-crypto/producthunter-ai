export type BillingPlan = {
  slug: "free" | "starter" | "pro" | "scale";
  name: string;
  description: string;
  price_cents: number;
  currency: "BRL";
  interval: "month";
  is_paid: boolean;
  highlight: boolean;
  badge?: string | null;
  monthly_recommendations: number;
  max_results_per_analysis: number;
  history_retention_days: number;
  seats: number;
  features: string[];
  stripe_configured: boolean;
  checkout_enabled: boolean;
};

export type BillingOverview = {
  plans: BillingPlan[];
};

export type SubscriptionStatus = {
  plan_slug: string;
  plan_name: string;
  status: string;
  is_active: boolean;
  cancel_at_period_end: boolean;
  current_period_end?: string | null;
  stripe_customer_id?: string | null;
  portal_enabled: boolean;
  monthly_recommendations: number;
  max_results_per_analysis: number;
  history_retention_days: number;
};

export type CheckoutResponse = {
  checkout_url: string;
};

export type PortalResponse = {
  portal_url: string;
};
