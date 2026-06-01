from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.auth import get_current_user
from app.models.auth_models import User
from app.schemas.billing_schema import (
    BillingOverview,
    CheckoutRequest,
    CheckoutResponse,
    PortalResponse,
    SubscriptionStatus,
)
from app.services.billing_service import (
    create_checkout_session,
    create_portal_session,
    handle_webhook,
    list_plans,
    subscription_status,
)

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/plans", response_model=BillingOverview)
def plans() -> BillingOverview:
    return BillingOverview(plans=list_plans())


@router.get("/subscription", response_model=SubscriptionStatus)
def current_subscription(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionStatus:
    return SubscriptionStatus(**subscription_status(db, user))


@router.post("/checkout", response_model=CheckoutResponse)
def checkout(
    payload: CheckoutRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CheckoutResponse:
    return CheckoutResponse(checkout_url=create_checkout_session(db, user, payload.plan_slug))


@router.post("/portal", response_model=PortalResponse)
def portal(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PortalResponse:
    return PortalResponse(portal_url=create_portal_session(db, user))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="stripe-signature"),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    return handle_webhook(await request.body(), stripe_signature, db)
