import { AlertTriangle, Clock, DatabaseZap, Sparkles, WalletCards } from "lucide-react";

import { RecommendationForm } from "../components/recommendation/RecommendationForm";
import { useRecommendationUsage } from "../hooks/useRecommendationUsage";
import type { RecommendationQuotaError } from "../types/recommendation";
import type { UserProfile } from "../types/userProfile";

type RecommendationProfileProps = {
  onGenerate: (profile: UserProfile) => Promise<void>;
  isLoading: boolean;
  onOpenPlans: () => void;
  quotaError?: RecommendationQuotaError | null;
  onClearQuotaError: () => void;
};

export function RecommendationProfile({ onGenerate, isLoading, onOpenPlans, quotaError, onClearQuotaError }: RecommendationProfileProps) {
  const { usage, isLoading: isUsageLoading, error: usageError, refetch: refetchUsage } = useRecommendationUsage();
  const usagePercent = usage ? Math.min(100, usage.usage_percent) : 0;
  const limitReached = Boolean(usage?.limit_reached);
  const shouldBlockForm = limitReached || quotaError?.code === "PLAN_MONTHLY_LIMIT_REACHED";

  return (
    <div className="min-h-screen py-6 md:py-10">
      <div className="mb-7 flex flex-col justify-between gap-5 md:mb-10 xl:flex-row xl:items-start">
        <div>
          <span className="kombai-chip kombai-chip-cyan">
            <DatabaseZap size={14} />
            IA em tempo real
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white md:mt-5 md:text-5xl">Simule seu Cenario</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400 md:mt-4 md:text-lg md:leading-8">
            Informe seu perfil e receba um ranking personalizado de oportunidades baseado em dados de mercado.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="kombai-chip kombai-chip-green">Dados atualizados</span>
          <span className="kombai-chip">
            <Clock size={14} />
            Historico
          </span>
        </div>
      </div>

      {quotaError && (
        <section className="kombai-card mb-5 border-amber-300/30 bg-amber-300/[0.08] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-300/25 bg-amber-300/10 text-amber-200">
                <AlertTriangle size={20} />
              </span>
              <div>
                <span className="kombai-chip kombai-chip-orange">
                  {quotaError.code === "PLAN_MONTHLY_LIMIT_REACHED" ? "Limite mensal" : "Limite por analise"}
                </span>
                <h2 className="mt-3 text-xl font-black text-white">{quotaErrorTitle(quotaError)}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{quotaError.message}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="kombai-btn kombai-btn-solid" onClick={onOpenPlans}>
                <Sparkles size={16} />
                Ver planos
              </button>
              <button
                type="button"
                className="kombai-btn"
                onClick={() => {
                  onClearQuotaError();
                  void refetchUsage();
                }}
              >
                Entendi
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <QuotaTile label="Plano" value={quotaError.planName ?? usage?.plan_name ?? "Atual"} />
            <QuotaTile label="Periodo" value={quotaError.periodMonth ?? usage?.period_month ?? "--"} />
            <QuotaTile label="Uso mensal" value={quotaUsageText(quotaError, usage?.generated_count, usage?.monthly_limit)} />
            <QuotaTile label="Restantes" value={String(quotaError.remaining ?? usage?.remaining ?? 0)} />
          </div>
        </section>
      )}

      <section className={limitReached ? "kombai-card mb-5 border-ember/30 bg-ember/10 p-5" : "kombai-card kombai-card-green mb-5 p-5"}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className={limitReached ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-300/25 bg-amber-300/10 text-amber-200" : "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-200"}>
              {limitReached ? <AlertTriangle size={20} /> : <WalletCards size={20} />}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-black text-white">Uso do plano</h2>
                <span className={limitReached ? "kombai-chip kombai-chip-orange" : "kombai-chip kombai-chip-green"}>
                  {usage?.plan_name ?? "Carregando"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {usage
                  ? `${usage.generated_count} de ${usage.monthly_limit} analises usadas em ${usage.period_month}. Restam ${usage.remaining}.`
                  : isUsageLoading
                    ? "Buscando seus limites mensais..."
                    : usageError ?? "Nao foi possivel carregar o uso agora."}
              </p>
            </div>
          </div>

          <div className="min-w-full lg:min-w-[260px]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-3xl font-black text-white">{usage?.remaining ?? "--"}</p>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">analises restantes</p>
              </div>
              <button type="button" className={limitReached ? "kombai-btn kombai-btn-solid" : "kombai-btn"} onClick={onOpenPlans}>
                <Sparkles size={16} />
                {limitReached ? "Fazer upgrade" : "Ver planos"}
              </button>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={limitReached ? "h-full rounded-full bg-amber-300 transition-[width] duration-500" : "h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-[width] duration-500"}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usage && (
              <p className="mt-2 text-right text-xs font-semibold text-slate-500">
                Ate {usage.max_results_per_analysis} produtos por analise.
              </p>
            )}
          </div>
        </div>
      </section>

      <RecommendationForm
        onSubmit={onGenerate}
        isLoading={isLoading}
        disabled={shouldBlockForm}
        usage={usage}
        onUpgrade={onOpenPlans}
      />
    </div>
  );
}

function QuotaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-mono text-base font-black text-white">{value}</p>
    </div>
  );
}

function quotaErrorTitle(error: RecommendationQuotaError) {
  if (error.code === "PLAN_MONTHLY_LIMIT_REACHED") {
    return "Seu limite mensal acabou";
  }
  if (error.code === "PLAN_RESULT_LIMIT_EXCEEDED") {
    return "Quantidade acima do seu plano";
  }
  return "Limite do plano";
}

function quotaUsageText(error: RecommendationQuotaError, generatedCount?: number, monthlyLimit?: number) {
  const used = error.generatedCount ?? generatedCount;
  const limit = error.monthlyLimit ?? monthlyLimit;
  if (typeof used === "number" && typeof limit === "number") {
    return `${used}/${limit}`;
  }
  if (typeof error.maxResultsPerAnalysis === "number") {
    return `Max ${error.maxResultsPerAnalysis}`;
  }
  return "--";
}
