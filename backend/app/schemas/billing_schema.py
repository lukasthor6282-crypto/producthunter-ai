from datetime import datetime

from pydantic import BaseModel, Field


class SubscriptionPlan(BaseModel):
    slug: str
    name: str
    description: str
    price_cents: int
    currency: str = "BRL"
    interval: str = "month"
    highlight: bool = False
    badge: str | None = None
    monthly_recommendations: int
    seats: int
    features: list[str]
    stripe_configured: bool


class BillingOverview(BaseModel):
    plans: list[SubscriptionPlan]


class SubscriptionStatus(BaseModel):
    plan_slug: str = "free"
    status: str = "free"
    is_active: bool = False
    cancel_at_period_end: bool = False
    current_period_end: datetime | None = None
    stripe_customer_id: str | None = None
    portal_enabled: bool = False


class CheckoutRequest(BaseModel):
    plan_slug: str = Field(..., min_length=1)


class CheckoutResponse(BaseModel):
    checkout_url: str


class PortalResponse(BaseModel):
    portal_url: str
