from datetime import datetime

from pydantic import BaseModel, Field


class SubscriptionPlan(BaseModel):
    slug: str
    name: str
    description: str
    price_cents: int
    currency: str = "BRL"
    interval: str = "month"
    is_paid: bool = True
    highlight: bool = False
    badge: str | None = None
    monthly_recommendations: int
    max_results_per_analysis: int
    history_retention_days: int
    seats: int
    features: list[str]
    stripe_configured: bool
    checkout_enabled: bool


class BillingOverview(BaseModel):
    plans: list[SubscriptionPlan]


class SubscriptionStatus(BaseModel):
    plan_slug: str = "free"
    plan_name: str = "Free"
    status: str = "free"
    is_active: bool = False
    cancel_at_period_end: bool = False
    current_period_end: datetime | None = None
    stripe_customer_id: str | None = None
    portal_enabled: bool = False
    monthly_recommendations: int = 10
    max_results_per_analysis: int = 8
    history_retention_days: int = 30


class CheckoutRequest(BaseModel):
    plan_slug: str = Field(..., min_length=1)


class CheckoutResponse(BaseModel):
    checkout_url: str


class PortalResponse(BaseModel):
    portal_url: str
