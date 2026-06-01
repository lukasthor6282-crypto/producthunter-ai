import { apiRequest } from "./api";
import type { BillingOverview, CheckoutResponse, PortalResponse, SubscriptionStatus } from "../types/billing";

export function getBillingPlans() {
  return apiRequest<BillingOverview>("/billing/plans");
}

export function getSubscriptionStatus() {
  return apiRequest<SubscriptionStatus>("/billing/subscription");
}

export function createCheckout(planSlug: string) {
  return apiRequest<CheckoutResponse>("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan_slug: planSlug }),
  });
}

export function createBillingPortal() {
  return apiRequest<PortalResponse>("/billing/portal", { method: "POST" });
}
