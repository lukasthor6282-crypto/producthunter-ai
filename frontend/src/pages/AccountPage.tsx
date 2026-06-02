import {
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  Database,
  Download,
  ExternalLink,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCircle2,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import { useBilling } from "../hooks/useBilling";
import { brl } from "../services/format";
import type { AuthUser } from "../types/auth";
import type { BillingPlan, SubscriptionStatus } from "../types/billing";

type AccountPageProps = {
  user?: AuthUser | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

type AccountTab = "profile" | "data" | "settings" | "plans";

type AccountSettings = {
  productAlerts: boolean;
  weeklyDigest: boolean;
  billingEmails: boolean;
  betaInsights: boolean;
  compactMetrics: boolean;
  safetyPrompts: boolean;
};

const accountSettingsStorageKey = "producthunter.account.settings.v1";

const defaultAccountSettings: AccountSettings = {
  productAlerts: true,
  weeklyDigest: true,
  billingEmails: true,
  betaInsights: false,
  compactMetrics: false,
  safetyPrompts: true,
};

const accountTabs: Array<{ key: AccountTab; label: string; icon: ComponentType<{ size?: number; className?: string }> }> = [
  { key: "profile", label: "Perfil", icon: UserCircle2 },
  { key: "data", label: "Dados", icon: Database },
  { key: "settings", label: "Configuracoes", icon: SlidersHorizontal },
  { key: "plans", label: "Planos", icon: CreditCard },
];

const planIcons: Record<BillingPlan["slug"], ComponentType<{ size?: number; className?: string }>> = {
  starter: Sparkles,
  pro: Crown,
  scale: Zap,
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function AccountPage({ user, onLogout, isLoggingOut }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [settings, setSettings] = useState<AccountSettings>(() => readAccountSettings());
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

  useEffect(() => {
    storeAccountSettings(settings);
  }, [settings]);

  const currentPlan = subscription?.is_active ? subscription.plan_slug : "free";
  const currentPlanDetails = plans.find((plan) => plan.slug === currentPlan);
  const planLimit = currentPlanDetails?.monthly_recommendations ?? 10;
  const planSeats = currentPlanDetails?.seats ?? 1;

  const accountHealth = useMemo(() => {
    const checks = [
      Boolean(user?.email_verified),
      Boolean(subscription?.is_active),
      settings.safetyPrompts,
      settings.billingEmails,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [settings.billingEmails, settings.safetyPrompts, subscription?.is_active, user?.email_verified]);

  const updateSetting = useCallback((key: keyof AccountSettings, value: boolean) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, []);

  const exportAccountData = useCallback(() => {
    const payload = {
      exported_at: new Date().toISOString(),
      user,
      subscription,
      settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "producthunter-perfil.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, [settings, subscription, user]);

  return (
    <div className="min-h-screen py-6 md:py-10">
      <header className="mb-6 grid gap-4 xl:grid-cols-[1.45fr_0.55fr] xl:items-end">
        <div>
          <span className="kombai-chip kombai-chip-cyan">
            <UserCircle2 size={14} />
            Conta
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">Perfil do cliente</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400 md:text-lg md:leading-8">
            Dados da conta, preferencias, seguranca e assinatura em um painel unico.
          </p>
        </div>

        <div className="kombai-card kombai-card-green p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status da conta</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-4xl font-black text-white">{accountHealth}</p>
              <p className="mt-1 text-sm font-semibold text-slate-400">score de configuracao</p>
            </div>
            <span className={user?.email_verified ? "kombai-chip kombai-chip-green" : "kombai-chip kombai-chip-orange"}>
              {user?.email_verified ? "Verificada" : "Pendente"}
            </span>
          </div>
        </div>
      </header>

      <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <AccountMetric icon={<CreditCard size={19} />} label="Plano atual" value={planName(currentPlan)} detail={subscription?.is_active ? friendlyStatus(subscription.status) : "Conta gratuita"} tone="cyan" />
        <AccountMetric icon={<Sparkles size={19} />} label="Analises mensais" value={planLimit.toLocaleString("pt-BR")} detail="limite do plano" tone="green" />
        <AccountMetric icon={<BadgeCheck size={19} />} label="Usuarios" value={String(planSeats)} detail="assentos incluidos" tone="orange" />
      </section>

      <div className="mb-6 grid gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-2 sm:grid-cols-4">
        {accountTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={
                isActive
                  ? "flex min-h-11 items-center justify-center gap-2 rounded-md border border-cyan-300/28 bg-cyan-300/[0.13] px-3 text-sm font-black text-cyan-100"
                  : "flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent px-3 text-sm font-bold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
              }
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "profile" && (
        <ProfileTab
          user={user}
          subscription={subscription}
          currentPlan={currentPlan}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          onExport={exportAccountData}
        />
      )}

      {activeTab === "data" && (
        <DataTab user={user} subscription={subscription} settings={settings} currentPlan={currentPlan} onExport={exportAccountData} />
      )}

      {activeTab === "settings" && <SettingsTab settings={settings} onChange={updateSetting} />}

      {activeTab === "plans" && (
        <PlansTab
          plans={plans}
          subscription={subscription}
          isLoading={isLoading}
          isCheckoutLoading={isCheckoutLoading}
          isPortalLoading={isPortalLoading}
          error={error}
          onCheckout={startCheckout}
          onPortal={openPortal}
        />
      )}
    </div>
  );
}

function ProfileTab({
  user,
  subscription,
  currentPlan,
  onLogout,
  isLoggingOut,
  onExport,
}: {
  user?: AuthUser | null;
  subscription: SubscriptionStatus | null;
  currentPlan: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
  onExport: () => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="kombai-card p-5">
        <div className="flex flex-col items-center text-center">
          <Avatar user={user} size="large" />
          <h2 className="mt-5 text-2xl font-black text-white">{user?.name ?? "Cliente ProductHunter"}</h2>
          <p className="mt-2 break-all text-sm font-semibold text-slate-400">{user?.email ?? "Conta Google"}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className={user?.email_verified ? "kombai-chip kombai-chip-green" : "kombai-chip kombai-chip-orange"}>
              <BadgeCheck size={14} />
              {user?.email_verified ? "E-mail verificado" : "Verificacao pendente"}
            </span>
            <span className="kombai-chip kombai-chip-cyan">
              <CreditCard size={14} />
              {planName(currentPlan)}
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          <button type="button" className="kombai-btn w-full" onClick={onExport}>
            <Download size={16} />
            Exportar dados
          </button>
          <button type="button" className="kombai-btn w-full border-ember/30 bg-ember/10 text-ember" onClick={onLogout} disabled={isLoggingOut}>
            <LogOut size={16} />
            {isLoggingOut ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="kombai-card p-5">
          <div className="flex items-center gap-3">
            <IconBox tone="cyan">
              <ShieldCheck size={19} />
            </IconBox>
            <div>
              <h2 className="font-black text-white">Seguranca</h2>
              <p className="mt-1 text-sm text-slate-500">Login Google, sessao protegida e token persistente.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoTile label="Autenticacao" value="Google" />
            <InfoTile label="Sessao" value="Ativa" />
            <InfoTile label="Cookie" value="Seguro" />
          </div>
        </div>

        <div className="kombai-card p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-black text-white">Assinatura</h2>
              <p className="mt-1 text-sm text-slate-500">Plano, status e renovacao.</p>
            </div>
            <span className={subscription?.is_active ? "kombai-chip kombai-chip-green" : "kombai-chip kombai-chip-orange"}>
              {subscription?.is_active ? friendlyStatus(subscription.status) : "Gratuito"}
            </span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoTile label="Plano" value={planName(currentPlan)} />
            <InfoTile label="Renovacao" value={formatDate(subscription?.current_period_end)} />
            <InfoTile label="Cancelamento" value={subscription?.cancel_at_period_end ? "Agendado" : "Nao agendado"} />
          </div>
        </div>
      </section>
    </div>
  );
}

function DataTab({
  user,
  subscription,
  settings,
  currentPlan,
  onExport,
}: {
  user?: AuthUser | null;
  subscription: SubscriptionStatus | null;
  settings: AccountSettings;
  currentPlan: string;
  onExport: () => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="kombai-card p-5">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Dados da conta</h2>
            <p className="mt-1 text-sm text-slate-500">Identidade, acesso e assinatura.</p>
          </div>
          <button type="button" className="kombai-btn" onClick={onExport}>
            <Download size={16} />
            Exportar
          </button>
        </div>

        <div className="grid gap-3">
          <DataRow icon={<UserCircle2 size={17} />} label="Nome" value={user?.name ?? "Nao informado"} />
          <DataRow icon={<Mail size={17} />} label="E-mail" value={user?.email ?? "Nao informado"} />
          <DataRow icon={<BadgeCheck size={17} />} label="Verificacao" value={user?.email_verified ? "E-mail verificado" : "Pendente"} />
          <DataRow icon={<CalendarDays size={17} />} label="Conta criada" value={formatDateTime(user?.created_at)} />
          <DataRow icon={<KeyRound size={17} />} label="Ultimo login" value={formatDateTime(user?.last_login_at)} />
          <DataRow icon={<CreditCard size={17} />} label="Plano atual" value={planName(currentPlan)} />
        </div>
      </section>

      <section className="grid gap-4">
        <div className="kombai-card p-5">
          <h2 className="text-xl font-black text-white">Resumo de privacidade</h2>
          <div className="mt-5 grid gap-3">
            <InfoTile label="Preferencias ativas" value={String(Object.values(settings).filter(Boolean).length)} />
            <InfoTile label="Portal Stripe" value={subscription?.portal_enabled ? "Ativo" : "Indisponivel"} />
            <InfoTile label="Cliente Stripe" value={subscription?.stripe_customer_id ? "Vinculado" : "Nao vinculado"} />
          </div>
        </div>

        <div className="kombai-card kombai-card-green p-5">
          <div className="flex items-start gap-3">
            <IconBox tone="green">
              <LockKeyhole size={19} />
            </IconBox>
            <div>
              <h2 className="font-black text-white">Protecao</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Dados sensiveis de pagamento ficam no Stripe. O ProductHunter guarda apenas status de assinatura e dados basicos da conta.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingsTab({ settings, onChange }: { settings: AccountSettings; onChange: (key: keyof AccountSettings, value: boolean) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <section className="kombai-card p-5">
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">Notificacoes</h2>
          <p className="mt-1 text-sm text-slate-500">Alertas de produto, resumo semanal e assinatura.</p>
        </div>
        <div className="grid gap-3">
          <SettingRow
            icon={<Bell size={18} />}
            title="Alertas de oportunidade"
            detail="Produtos com alta demanda, margem ou queda de concorrencia."
            checked={settings.productAlerts}
            onChange={(value) => onChange("productAlerts", value)}
          />
          <SettingRow
            icon={<CalendarDays size={18} />}
            title="Resumo semanal"
            detail="Ranking, nichos em alta e alertas consolidados."
            checked={settings.weeklyDigest}
            onChange={(value) => onChange("weeklyDigest", value)}
          />
          <SettingRow
            icon={<CreditCard size={18} />}
            title="E-mails de assinatura"
            detail="Renovacao, checkout, portal e mudancas de plano."
            checked={settings.billingEmails}
            onChange={(value) => onChange("billingEmails", value)}
          />
        </div>
      </section>

      <section className="kombai-card p-5">
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">Experiencia</h2>
          <p className="mt-1 text-sm text-slate-500">Preferencias salvas neste navegador.</p>
        </div>
        <div className="grid gap-3">
          <SettingRow
            icon={<Sparkles size={18} />}
            title="Insights beta"
            detail="Exibir sinais experimentais do laboratorio de IA."
            checked={settings.betaInsights}
            onChange={(value) => onChange("betaInsights", value)}
          />
          <SettingRow
            icon={<SlidersHorizontal size={18} />}
            title="Metricas compactas"
            detail="Priorizar tabelas e indicadores mais densos."
            checked={settings.compactMetrics}
            onChange={(value) => onChange("compactMetrics", value)}
          />
          <SettingRow
            icon={<ShieldCheck size={18} />}
            title="Confirmacoes de seguranca"
            detail="Manter confirmacoes antes de acoes sensiveis."
            checked={settings.safetyPrompts}
            onChange={(value) => onChange("safetyPrompts", value)}
          />
        </div>
      </section>
    </div>
  );
}

function PlansTab({
  plans,
  subscription,
  isLoading,
  isCheckoutLoading,
  isPortalLoading,
  error,
  onCheckout,
  onPortal,
}: {
  plans: BillingPlan[];
  subscription: SubscriptionStatus | null;
  isLoading: boolean;
  isCheckoutLoading: boolean;
  isPortalLoading: boolean;
  error: string | null;
  onCheckout: (planSlug: string) => void;
  onPortal: () => void;
}) {
  const currentPlan = subscription?.is_active ? subscription.plan_slug : "free";

  return (
    <div className="space-y-4">
      <section className="kombai-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Plano atual</h2>
            <p className="mt-1 text-sm text-slate-500">{planName(currentPlan)} · {subscription?.is_active ? friendlyStatus(subscription.status) : "Conta gratuita"}</p>
          </div>
          {subscription?.portal_enabled && (
            <button type="button" className="kombai-btn" onClick={onPortal} disabled={isPortalLoading}>
              <ExternalLink size={16} />
              {isPortalLoading ? "Abrindo..." : "Gerenciar assinatura"}
            </button>
          )}
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-ember/30 bg-ember/10 p-4 text-sm font-semibold text-ember">
          {friendlyBillingError(error)}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="kombai-card p-5">
                <div className="shimmer h-12 rounded-lg bg-white/[0.06]" />
                <div className="shimmer mt-5 h-32 rounded-lg bg-white/[0.05]" />
              </div>
            ))
          : plans.map((plan) => (
              <AccountPlanCard
                key={plan.slug}
                plan={plan}
                current={currentPlan === plan.slug}
                loading={isCheckoutLoading}
                onChoose={() => onCheckout(plan.slug)}
              />
            ))}
      </section>
    </div>
  );
}

function AccountPlanCard({ plan, current, loading, onChoose }: { plan: BillingPlan; current: boolean; loading: boolean; onChoose: () => void }) {
  const Icon = planIcons[plan.slug];
  const disabled = current || !plan.stripe_configured || loading;

  return (
    <article className={plan.highlight ? "kombai-card kombai-card-green p-5 ring-1 ring-emerald-300/25" : "kombai-card p-5"}>
      <div className="flex items-start justify-between gap-4">
        <IconBox tone={plan.highlight ? "green" : "cyan"}>
          <Icon size={20} />
        </IconBox>
        {plan.badge && <span className={plan.highlight ? "kombai-chip kombai-chip-green" : "kombai-chip"}>{plan.badge}</span>}
      </div>
      <h3 className="mt-5 text-2xl font-black text-white">{plan.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{plan.description}</p>
      <div className="mt-5">
        <span className="font-mono text-4xl font-black text-white">{brl.format(plan.price_cents / 100)}</span>
        <span className="ml-2 text-sm font-semibold text-slate-500">/ mes</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoTile label="Analises" value={plan.monthly_recommendations.toLocaleString("pt-BR")} />
        <InfoTile label="Usuarios" value={String(plan.seats)} />
      </div>
      <ul className="mt-5 space-y-3">
        {plan.features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-300">
            <Check size={16} className="mt-1 shrink-0 text-mint" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={plan.highlight ? "kombai-btn kombai-btn-solid mt-6 w-full" : "kombai-btn mt-6 w-full"}
        disabled={disabled}
        onClick={onChoose}
      >
        <CreditCard size={16} />
        {current ? "Plano atual" : !plan.stripe_configured ? "Checkout indisponivel" : loading ? "Abrindo..." : "Assinar"}
      </button>
    </article>
  );
}

function AccountMetric({ icon, label, value, detail, tone }: { icon: ReactNode; label: string; value: string; detail: string; tone: "cyan" | "green" | "orange" }) {
  return (
    <article className={tone === "green" ? "kombai-card kombai-card-green p-4" : "kombai-card p-4"}>
      <div className="flex items-center justify-between gap-4">
        <IconBox tone={tone}>{icon}</IconBox>
        <span className={tone === "orange" ? "kombai-chip kombai-chip-orange" : tone === "green" ? "kombai-chip kombai-chip-green" : "kombai-chip kombai-chip-cyan"}>
          {detail}
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-3xl font-black text-white">{value}</p>
    </article>
  );
}

function Avatar({ user, size = "normal" }: { user?: AuthUser | null; size?: "normal" | "large" }) {
  const className = size === "large" ? "h-24 w-24 text-3xl" : "h-12 w-12 text-base";
  return (
    <span className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-300/25 bg-cyan-300/10 font-black text-cyan-100 shadow-[0_0_34px_rgba(98,230,255,0.14)]`}>
      {user?.picture_url ? (
        <img src={user.picture_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        getInitials(user)
      )}
    </span>
  );
}

function DataRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="data-row grid gap-3 p-4 sm:grid-cols-[180px_1fr] sm:items-center">
      <div className="flex items-center gap-3 text-slate-400">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-cyan-200">
          {icon}
        </span>
        <span className="text-sm font-black uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="min-w-0 break-words text-sm font-semibold text-white sm:text-right">{value}</p>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-mono text-base font-black text-white">{value}</p>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  detail,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="data-row flex items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className={checked ? "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200" : "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-slate-500"}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-black text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={checked ? "relative h-8 w-14 shrink-0 rounded-full border border-cyan-300/30 bg-cyan-300/25" : "relative h-8 w-14 shrink-0 rounded-full border border-white/10 bg-white/[0.06]"}
      >
        <span
          className={
            checked
              ? "absolute left-7 top-1 h-6 w-6 rounded-full bg-cyan-100 shadow-[0_0_20px_rgba(98,230,255,0.45)] transition"
              : "absolute left-1 top-1 h-6 w-6 rounded-full bg-slate-500 transition"
          }
        />
      </button>
    </div>
  );
}

function IconBox({ children, tone }: { children: ReactNode; tone: "cyan" | "green" | "orange" }) {
  const className =
    tone === "green"
      ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
      : tone === "orange"
        ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
        : "border-cyan-300/25 bg-cyan-300/10 text-cyan-200";

  return <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${className}`}>{children}</span>;
}

function readAccountSettings(): AccountSettings {
  if (typeof window === "undefined") {
    return defaultAccountSettings;
  }

  try {
    const raw = window.localStorage.getItem(accountSettingsStorageKey);
    if (!raw) {
      return defaultAccountSettings;
    }

    const parsed = JSON.parse(raw) as Partial<AccountSettings>;
    return { ...defaultAccountSettings, ...parsed };
  } catch {
    return defaultAccountSettings;
  }
}

function storeAccountSettings(settings: AccountSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(accountSettingsStorageKey, JSON.stringify(settings));
}

function getInitials(user?: AuthUser | null) {
  const source = user?.name || user?.email || "PH";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Nao informado";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Nao informado" : dateFormatter.format(date);
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Nao informado";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Nao informado" : dateTimeFormatter.format(date);
}

function planName(slug: string) {
  if (slug === "starter") return "Starter";
  if (slug === "pro") return "Pro";
  if (slug === "scale") return "Scale";
  return "Free";
}

function friendlyStatus(status: string) {
  if (status === "active") return "Ativo";
  if (status === "trialing") return "Teste";
  if (status === "past_due") return "Pagamento pendente";
  if (status === "canceled") return "Cancelado";
  return status || "Gratuito";
}

function friendlyBillingError(error: string) {
  if (error.includes("STRIPE_PRICE")) {
    return "Os planos ainda precisam dos Price IDs do Stripe para ativar o checkout.";
  }
  if (error.includes("STRIPE_SECRET_KEY")) {
    return "A chave secreta do Stripe ainda nao foi configurada no backend.";
  }
  return error;
}
