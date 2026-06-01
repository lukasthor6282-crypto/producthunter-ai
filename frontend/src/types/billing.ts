export type BillingPlan = {
  slug: "starter" | "pro" | "scale";
  name: string;
  description: string;
  price_cents: number;
  currency: "BRL";
  interval: "month";
  highlight: boolean;
  badge?: string | null;
  monthly_recommendations: number;
  seats: number;
  features: string[];
  stripe_configured: boolean;
};

export type BillingOverview = {
  plans: BillingPlan[];
};

export type SubscriptionStatus = {
  plan_slug: string;
  status: string;
  is_active: boolean;
  cancel_at_period_end: boolean;
  current_period_end?: string | null;
  stripe_customer_id?: string | null;
  portal_enabled: boolean;
};

export type CheckoutResponse = {
  checkout_url: string;
};

export type PortalResponse = {
  portal_url: string;
};
