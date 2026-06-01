import { Check, CreditCard, Crown, ExternalLink, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { ComponentType } from "react";

import { useBilling } from "../hooks/useBilling";
import { brl } from "../services/format";
import type { BillingPlan } from "../types/billing";

const planIcons: Record<BillingPlan["slug"], ComponentType<{ size?: number; className?: string }>> = {
  starter: Sparkles,
  pro: Crown,
  scale: Zap,
};

export function SubscriptionPage() {
  const {
    plans,
    subscription,
    isLoading,
    isCheckoutLoading,
    isPortalLoading,
    startCheckout,
    openPortal,
    error,
  } = useBilling();

  const currentPlan = subscription?.is_active ? subscription.plan_slug : "free";

  return (
    <div className="min-h-screen py-6 md:py-10">
      <header className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <span className="kombai-chip kombai-chip-cyan">
            <CreditCard size={14} />
            Assinaturas
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">Planos do ProductHunter</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400 md:text-lg md:leading-8">
            Comece barato, valide o produto e aumente o plano quando sua operação precisar de mais análises.
          </p>
        </div>

        <div className="kombai-card kombai-card-green p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Plano atual</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-black text-white">{planName(currentPlan)}</span>
            <span className={subscription?.is_active ? "kombai-chip kombai-chip-green" : "kombai-chip kombai-chip-orange"}>
              {subscription?.is_active ? "Ativo" : "Gratuito"}
            </span>
          </div>
          {subscription?.portal_enabled && (
            <button
              className="kombai-btn mt-4 w-full"
              type="button"
              disabled={isPortalLoading}
              onClick={() => openPortal()}
            >
              <ExternalLink size={16} />
              {isPortalLoading ? "Abrindo..." : "Gerenciar assinatura"}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="mb-5 rounded-lg border border-ember/30 bg-ember/10 p-4 text-sm font-semibold text-ember">
          {friendlyError(error)}
        </div>
      )}

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="kombai-card p-6">
              <div className="shimmer h-10 rounded-lg bg-white/[0.06]" />
              <div className="shimmer mt-5 h-32 rounded-lg bg-white/[0.05]" />
            </div>
          ))
        ) : (
          plans.map((plan) => (
            <PlanCard
              key={plan.slug}
              plan={plan}
              current={currentPlan === plan.slug}
              loading={isCheckoutLoading}
              onChoose={() => startCheckout(plan.slug)}
            />
          ))
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="kombai-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h2 className="font-black text-white">Modelo recomendado</h2>
              <p className="mt-1 text-sm text-slate-500">Use o Pro como plano principal.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            O Starter ajuda a validar o produto. O Pro deve ser o foco de venda porque entrega valor suficiente para
            vendedores recorrentes sem parecer caro. O Scale fica para quem já tem operação maior.
          </p>
        </div>

        <div className="kombai-card p-5">
          <h2 className="font-black text-white">Configuração Stripe</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Crie três produtos recorrentes no Stripe, copie os Price IDs e configure
            <span className="font-mono text-cyan-200"> STRIPE_PRICE_STARTER</span>,
            <span className="font-mono text-cyan-200"> STRIPE_PRICE_PRO</span> e
            <span className="font-mono text-cyan-200"> STRIPE_PRICE_SCALE</span> no Render.
          </p>
        </div>
      </section>
    </div>
  );
}

function PlanCard({ plan, current, loading, onChoose }: { plan: BillingPlan; current: boolean; loading: boolean; onChoose: () => void }) {
  const Icon = planIcons[plan.slug];
  const price = brl.format(plan.price_cents / 100);
  const disabled = current || !plan.stripe_configured || loading;

  return (
    <article className={plan.highlight ? "kombai-card kombai-card-green p-5 ring-1 ring-emerald-300/25" : "kombai-card p-5"}>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          <Icon size={20} />
        </span>
        {plan.badge && <span className={plan.highlight ? "kombai-chip kombai-chip-green" : "kombai-chip"}>{plan.badge}</span>}
      </div>

      <h2 className="mt-6 text-2xl font-black text-white">{plan.name}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{plan.description}</p>

      <div className="mt-6">
        <span className="font-mono text-4xl font-black text-white">{price}</span>
        <span className="ml-2 text-sm font-semibold text-slate-500">/ mês</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Metric label="Análises" value={plan.monthly_recommendations.toLocaleString("pt-BR")} />
        <Metric label="Usuários" value={String(plan.seats)} />
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-300">
            <Check size={16} className="mt-1 shrink-0 text-mint" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={plan.highlight ? "kombai-btn kombai-btn-solid mt-7 w-full" : "kombai-btn mt-7 w-full"}
        disabled={disabled}
        onClick={onChoose}
      >
        <CreditCard size={16} />
        {current ? "Plano atual" : !plan.stripe_configured ? "Configurar Stripe" : loading ? "Abrindo..." : "Assinar"}
      </button>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-black text-white">{value}</p>
    </div>
  );
}

function planName(slug: string) {
  if (slug === "starter") return "Starter";
  if (slug === "pro") return "Pro";
  if (slug === "scale") return "Scale";
  return "Free";
}

function friendlyError(error: string) {
  if (error.includes("STRIPE_PRICE")) {
    return "Falta configurar os Price IDs do Stripe no Render para ativar o checkout.";
  }
  if (error.includes("STRIPE_SECRET_KEY")) {
    return "Falta configurar a chave secreta do Stripe no Render.";
  }
  return error;
}
