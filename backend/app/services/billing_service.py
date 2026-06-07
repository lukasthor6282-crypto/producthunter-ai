from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.auth_models import User
from app.models.billing_models import BillingSubscription

try:
    import stripe
except ImportError:  # pragma: no cover - only happens before dependencies are installed
    stripe = None


STRIPE_API_VERSION = "2026-02-25.clover"

ACTIVE_SUBSCRIPTION_STATUSES = {"active", "trialing"}

PLAN_CATALOG: dict[str, dict[str, Any]] = {
    "free": {
        "name": "Free",
        "description": "Para testar o ProductHunter com poucas analises mensais.",
        "price_cents": 0,
        "monthly_recommendations": 10,
        "max_results_per_analysis": 8,
        "history_retention_days": 30,
        "seats": 1,
        "badge": "Teste inicial",
        "features": [
            "10 analises de produtos por mes",
            "Ate 8 produtos por analise",
            "Historico por 30 dias",
            "Score de oportunidade essencial",
        ],
    },
    "starter": {
        "name": "Starter",
        "description": "Para validar nichos e rodar as primeiras apostas com IA.",
        "price_cents": 2900,
        "monthly_recommendations": 80,
        "max_results_per_analysis": 12,
        "history_retention_days": 90,
        "seats": 1,
        "badge": "Comeco inteligente",
        "features": [
            "80 analises de produtos por mes",
            "Ate 12 produtos por analise",
            "Ranking com score de oportunidade",
            "Simulador de lucro basico",
            "Historico de recomendacoes por 90 dias",
        ],
    },
    "pro": {
        "name": "Pro",
        "description": "Plano principal para afiliados e vendedores que analisam produtos toda semana.",
        "price_cents": 7900,
        "monthly_recommendations": 350,
        "max_results_per_analysis": 20,
        "history_retention_days": 365,
        "seats": 1,
        "highlight": True,
        "badge": "Mais recomendado",
        "features": [
            "350 analises de produtos por mes",
            "Ate 20 produtos por analise",
            "Filtros avancados por nicho, risco e margem",
            "Laboratorio de IA e explicacao detalhada",
            "Comparativos e simulacoes completas",
            "Prioridade em novos recursos",
        ],
    },
    "scale": {
        "name": "Scale",
        "description": "Para operacoes com mais volume, equipe pequena ou varias lojas.",
        "price_cents": 14900,
        "monthly_recommendations": 1200,
        "max_results_per_analysis": 30,
        "history_retention_days": 730,
        "seats": 3,
        "badge": "Operacao em escala",
        "features": [
            "1.200 analises de produtos por mes",
            "Ate 30 produtos por analise",
            "3 usuarios na mesma operacao",
            "Alertas de oportunidade e risco",
            "Suporte prioritario",
            "Preparado para integracoes futuras",
        ],
    },
}


def _stripe_price_id(plan_slug: str) -> str | None:
    if plan_slug == "free":
        return None

    settings = get_settings()
    return {
        "starter": settings.stripe_price_starter,
        "pro": settings.stripe_price_pro,
        "scale": settings.stripe_price_scale,
    }.get(plan_slug)


def list_plans() -> list[dict[str, Any]]:
    return [
        {
            "slug": slug,
            "currency": "BRL",
            "interval": "month",
            "is_paid": slug != "free",
            "highlight": bool(plan.get("highlight")),
            "checkout_enabled": slug != "free" and bool(_stripe_price_id(slug)),
            "stripe_configured": slug == "free" or bool(_stripe_price_id(slug)),
            **plan,
        }
        for slug, plan in PLAN_CATALOG.items()
    ]


def get_plan(plan_slug: str) -> dict[str, Any]:
    plan = PLAN_CATALOG.get(plan_slug)
    if plan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano nao encontrado.")
    return plan


def get_subscription(db: Session, user: User) -> BillingSubscription | None:
    return db.query(BillingSubscription).filter(BillingSubscription.user_id == user.id).one_or_none()


def active_plan_slug(db: Session, user: User) -> str:
    subscription = get_subscription(db, user)
    if subscription and subscription.status in ACTIVE_SUBSCRIPTION_STATUSES and subscription.plan_slug in PLAN_CATALOG:
        return subscription.plan_slug
    return "free"


def plan_limits(plan_slug: str) -> dict[str, Any]:
    plan = PLAN_CATALOG.get(plan_slug) or PLAN_CATALOG["free"]
    return {
        "plan_slug": plan_slug if plan_slug in PLAN_CATALOG else "free",
        "plan_name": plan["name"],
        "monthly_recommendations": int(plan["monthly_recommendations"]),
        "max_results_per_analysis": int(plan["max_results_per_analysis"]),
        "history_retention_days": int(plan["history_retention_days"]),
    }


def subscription_status(db: Session, user: User) -> dict[str, Any]:
    subscription = get_subscription(db, user)
    if subscription is None:
        limits = plan_limits("free")
        return {
            "plan_slug": "free",
            "plan_name": limits["plan_name"],
            "status": "free",
            "is_active": False,
            "cancel_at_period_end": False,
            "current_period_end": None,
            "stripe_customer_id": None,
            "portal_enabled": False,
            "monthly_recommendations": limits["monthly_recommendations"],
            "max_results_per_analysis": limits["max_results_per_analysis"],
            "history_retention_days": limits["history_retention_days"],
        }

    current_plan = subscription.plan_slug if subscription.status in ACTIVE_SUBSCRIPTION_STATUSES else "free"
    limits = plan_limits(current_plan)
    return {
        "plan_slug": limits["plan_slug"],
        "plan_name": limits["plan_name"],
        "status": subscription.status,
        "is_active": subscription.status in ACTIVE_SUBSCRIPTION_STATUSES,
        "cancel_at_period_end": subscription.cancel_at_period_end,
        "current_period_end": subscription.current_period_end,
        "stripe_customer_id": subscription.stripe_customer_id,
        "portal_enabled": bool(subscription.stripe_customer_id and get_settings().stripe_secret_key),
        "monthly_recommendations": limits["monthly_recommendations"],
        "max_results_per_analysis": limits["max_results_per_analysis"],
        "history_retention_days": limits["history_retention_days"],
    }


def _require_stripe():
    settings = get_settings()
    if stripe is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Instale a dependencia stripe no backend.")
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Configure STRIPE_SECRET_KEY no backend.")
    stripe.api_key = settings.stripe_secret_key
    stripe.api_version = STRIPE_API_VERSION
    return stripe


def _get_or_create_local_subscription(db: Session, user: User) -> BillingSubscription:
    subscription = get_subscription(db, user)
    if subscription is not None:
        return subscription

    subscription = BillingSubscription(user_id=user.id)
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


def _timestamp_to_datetime(value: int | None) -> datetime | None:
    if value is None:
        return None
    return datetime.fromtimestamp(value, tz=timezone.utc)


def create_checkout_session(db: Session, user: User, plan_slug: str) -> str:
    plan = get_plan(plan_slug)
    if plan_slug == "free":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="O plano Free nao precisa de checkout.")

    price_id = _stripe_price_id(plan_slug)
    if not price_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Configure STRIPE_PRICE_{plan_slug.upper()} no backend para vender o plano {plan['name']}.",
        )

    stripe_client = _require_stripe()
    settings = get_settings()
    subscription = _get_or_create_local_subscription(db, user)

    if not subscription.stripe_customer_id:
        customer = stripe_client.Customer.create(
            email=user.email,
            name=user.name,
            metadata={"user_id": str(user.id)},
        )
        subscription.stripe_customer_id = customer["id"]
        db.commit()
        db.refresh(subscription)

    checkout = stripe_client.checkout.Session.create(
        mode="subscription",
        customer=subscription.stripe_customer_id,
        line_items=[{"price": price_id, "quantity": 1}],
        allow_promotion_codes=True,
        success_url=f"{settings.app_public_url}/?billing=success",
        cancel_url=f"{settings.app_public_url}/?billing=cancelled",
        metadata={"user_id": str(user.id), "plan_slug": plan_slug},
        subscription_data={"metadata": {"user_id": str(user.id), "plan_slug": plan_slug}},
    )
    return checkout["url"]


def create_portal_session(db: Session, user: User) -> str:
    stripe_client = _require_stripe()
    subscription = get_subscription(db, user)
    if not subscription or not subscription.stripe_customer_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cliente Stripe ainda nao existe para este usuario.")

    portal = stripe_client.billing_portal.Session.create(
        customer=subscription.stripe_customer_id,
        return_url=get_settings().app_public_url,
    )
    return portal["url"]


def _plan_slug_from_price(price_id: str | None) -> str:
    for slug in PLAN_CATALOG:
        if slug == "free":
            continue
        if _stripe_price_id(slug) == price_id:
            return slug
    return "free"


def sync_stripe_subscription(db: Session, subscription_data: dict[str, Any], user_id: int | None = None) -> None:
    stripe_subscription_id = subscription_data.get("id")
    customer_id = subscription_data.get("customer")
    price_id = None
    items = subscription_data.get("items", {}).get("data", [])
    if items:
        price_id = items[0].get("price", {}).get("id")

    query = db.query(BillingSubscription)
    subscription = None
    if stripe_subscription_id:
        subscription = query.filter(BillingSubscription.stripe_subscription_id == stripe_subscription_id).one_or_none()
    if subscription is None and customer_id:
        subscription = query.filter(BillingSubscription.stripe_customer_id == customer_id).one_or_none()
    if subscription is None and user_id is not None:
        subscription = query.filter(BillingSubscription.user_id == user_id).one_or_none()
    if subscription is None and user_id is not None:
        subscription = BillingSubscription(user_id=user_id)
        db.add(subscription)

    if subscription is None:
        return

    subscription.stripe_customer_id = customer_id or subscription.stripe_customer_id
    subscription.stripe_subscription_id = stripe_subscription_id or subscription.stripe_subscription_id
    subscription.stripe_price_id = price_id
    subscription.plan_slug = _plan_slug_from_price(price_id)
    subscription.status = subscription_data.get("status", "incomplete")
    subscription.cancel_at_period_end = bool(subscription_data.get("cancel_at_period_end"))
    subscription.current_period_start = _timestamp_to_datetime(subscription_data.get("current_period_start"))
    subscription.current_period_end = _timestamp_to_datetime(subscription_data.get("current_period_end"))
    db.commit()


def handle_webhook(payload: bytes, signature: str | None, db: Session) -> dict[str, str]:
    stripe_client = _require_stripe()
    settings = get_settings()
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Configure STRIPE_WEBHOOK_SECRET no backend.")

    try:
        event = stripe_client.Webhook.construct_event(payload, signature, settings.stripe_webhook_secret)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Webhook Stripe invalido.") from exc

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        user_id = int(data.get("metadata", {}).get("user_id", "0") or 0) or None
        stripe_subscription_id = data.get("subscription")
        if stripe_subscription_id:
            subscription_data = stripe_client.Subscription.retrieve(stripe_subscription_id)
            sync_stripe_subscription(db, subscription_data, user_id=user_id)
    elif event_type in {"customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"}:
        sync_stripe_subscription(db, data)

    return {"received": "true"}
