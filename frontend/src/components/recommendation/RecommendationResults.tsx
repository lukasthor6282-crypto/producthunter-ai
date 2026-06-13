import type { ReactNode } from "react";
import { Bot, Calculator, Filter, Pencil, Search, SlidersHorizontal, Sparkles, Zap } from "lucide-react";

import { OpportunityRadar } from "../dashboard/OpportunityRadar";
import { OpportunityScoreRing } from "../dashboard/OpportunityScoreRing";
import { ProductImage } from "../product/ProductImage";
import { brl, percent } from "../../services/format";
import type { RecommendationItem, RecommendationResponse } from "../../types/recommendation";
import { profileOptionLabel } from "../../types/userProfile";

type RecommendationResultsProps = {
  data: RecommendationResponse | null;
  selectedItem?: RecommendationItem;
  onSelect: (item: RecommendationItem) => void;
  onEditProfile?: () => void;
  onOpenDetail?: () => void;
  onSimulate?: () => void;
};

export function RecommendationResults({ data, selectedItem, onSelect, onEditProfile, onOpenDetail, onSimulate }: RecommendationResultsProps) {
  const responseProfile = data?.profile;
  const items = responseProfile ? (data?.recommendations ?? []).filter((item) => item.product.niche === responseProfile.niche) : data?.recommendations ?? [];
  const selectedItemInCurrentRanking = selectedItem && items.some((item) => item.product.id === selectedItem.product.id);
  const best = selectedItemInCurrentRanking ? selectedItem : items[0];

  if (!items.length || !best || !data) {
    const hasGeneratedEmptyState = Boolean(data && !items.length);

    return (
      <div className="kombai-card p-8">
        <span className="kombai-chip kombai-chip-cyan">{hasGeneratedEmptyState ? "Sem produto compativel" : "Ranking vazio"}</span>
        <h1 className="font-display mt-4 text-3xl font-bold text-white">
          {hasGeneratedEmptyState ? "Nenhuma oportunidade segura para este perfil." : "Gere um perfil para ver oportunidades."}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          {hasGeneratedEmptyState
            ? data?.message ?? "Nao encontrei produtos do nicho informado que respeitem a verba e o tipo de operacao escolhidos."
            : "O resultado aparece aqui com score, margem, lucro, conversao, concorrencia, risco, motivo e estrategia."}
        </p>
        {responseProfile ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <ProfileChip tone="orange">{profileOptionLabel("marketplace", responseProfile.marketplace)}</ProfileChip>
            <ProfileChip tone="green">{profileOptionLabel("niche", responseProfile.niche)}</ProfileChip>
            <ProfileChip tone="orange">{profileOptionLabel("investment_range", responseProfile.investment_range).replace("R$ ", "R$")}</ProfileChip>
          </div>
        ) : null}
        {onEditProfile ? (
          <button className="kombai-btn mt-6 w-fit" onClick={onEditProfile}>
            <Pencil size={16} />
            Editar perfil
          </button>
        ) : null}
      </div>
    );
  }

  const profile = data.profile;
  const bestRank = items.findIndex((item) => item.product.id === best.product.id) + 1 || 1;

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Perfil:</span>
            <ProfileChip tone="cyan">{profileOptionLabel("operation_type", profile.operation_type)}</ProfileChip>
            <ProfileChip tone="orange">{profileOptionLabel("marketplace", profile.marketplace)}</ProfileChip>
            <ProfileChip tone="green">{profileOptionLabel("niche", profile.niche)}</ProfileChip>
            <ProfileChip tone="violet">{shortGoal(profileOptionLabel("goal", profile.goal))}</ProfileChip>
            <ProfileChip tone="orange">{profileOptionLabel("investment_range", profile.investment_range).replace("R$ ", "R$")}</ProfileChip>
            <ProfileChip>{profileOptionLabel("experience_level", profile.experience_level)}</ProfileChip>
          </div>
          <h1 className="font-display mt-4 text-3xl font-bold leading-tight text-white md:mt-5 md:text-5xl">
            Ranking de Oportunidades
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
            {items.length} produtos encontrados, ordenados por score de oportunidade e aderencia ao seu perfil.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="kombai-chip"><Filter size={14} />Filtrar</button>
          <button className="kombai-chip"><SlidersHorizontal size={14} />Ordenar</button>
          <button className="kombai-chip" onClick={onEditProfile}><Pencil size={14} />Editar perfil</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <section className="kombai-card p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Cenario analisado</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ProfileChip tone="cyan">{profileOptionLabel("operation_type", profile.operation_type)}</ProfileChip>
              <ProfileChip tone="orange">{profileOptionLabel("marketplace", profile.marketplace)}</ProfileChip>
              <ProfileChip tone="green">{profileOptionLabel("niche", profile.niche)}</ProfileChip>
              <ProfileChip tone="orange">{profileOptionLabel("investment_range", profile.investment_range).replace("R$ ", "R$")}</ProfileChip>
            </div>
          </section>

          <OpportunityRadar compact score={best.opportunity_score} subtitle="Compatibilidade do melhor produto com o perfil." />

          <section className="kombai-card kombai-card-purple p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet/40 bg-violet/15 text-violet-200">
                <Bot size={18} />
              </span>
              <div>
                <p className="text-xs font-black uppercase text-violet-300">Analise da IA</p>
                <p className="text-xs text-slate-600">Atualizada agora</p>
              </div>
            </div>
            <p className="text-sm font-medium leading-7 text-slate-400">
              Com base em <strong className="text-white">{profileOptionLabel("operation_type", profile.operation_type).toLowerCase()}</strong>, nicho{" "}
              <strong className="text-cyan-200">{profileOptionLabel("niche", profile.niche).toLowerCase()}</strong> e verba{" "}
              <strong className="text-mint">{profileOptionLabel("investment_range", profile.investment_range).replace("R$ ", "R$")}</strong>, este ranking prioriza produtos com aderencia comercial, margem defensavel e risco controlado.
            </p>
          </section>
        </aside>

        <section className="space-y-4">
          <BestProductCard item={best} rank={bestRank} onOpenDetail={onOpenDetail} onSimulate={onSimulate} />
          <div className="space-y-3">
            {items.filter((item) => item.product.id !== best.product.id).slice(0, 4).map((item, index) => (
              <ResultRow key={item.product.id} item={item} rank={index + 2} selected={false} onClick={() => onSelect(item)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BestProductCard({ item, rank, onOpenDetail, onSimulate }: { item: RecommendationItem; rank: number; onOpenDetail?: () => void; onSimulate?: () => void }) {
  return (
    <article className="kombai-card border-cyan-300/24 bg-[#0b111b]/92 p-4 md:p-7">
      <div className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="relative shrink-0">
            <ProductImage product={item.product} className="h-20 w-20 md:h-24 md:w-24" iconSize={28} />
            <span className="absolute -left-2 -top-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300 to-orange-500 text-lg font-black text-[#07090d] shadow-[0_0_36px_rgba(246,179,91,0.28)]">
              {rank}
            </span>
          </div>
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="kombai-chip kombai-chip-cyan">#{rank} escolha da IA</span>
              <span className="kombai-chip kombai-chip-orange">{item.product.marketplace_label}</span>
              <span className="kombai-chip">{item.product.niche_label}</span>
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight text-white md:text-4xl">{item.product.name}</h2>
          </div>
        </div>
        <OpportunityScoreRing score={item.opportunity_score} size="lg" />
      </div>

      <div className="grid grid-cols-2 border-y border-white/10 sm:grid-cols-3 md:grid-cols-5">
        <HeroMetric label="Margem" value={percent(item.estimated_margin_percent)} tone="text-mint" />
        <HeroMetric label="Lucro/Unid" value={brl.format(item.estimated_profit)} />
        <HeroMetric label="Conversao" value={percent(item.conversion_probability, 1)} tone="text-cyan-200" />
        <HeroMetric label="Concorrencia" value={competitionLabel(item.competition_score)} />
        <HeroMetric label="Risco" value={riskLabel(item.risk_score)} tone={item.risk_score < 45 ? "text-mint" : "text-amber-200"} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <InsightBox icon={<Sparkles size={16} />} title="Motivo da recomendacao" text={item.explanation} tone="violet" />
        <InsightBox icon={<Zap size={16} />} title="Estrategia recomendada" text={item.recommended_strategy} tone="cyan" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button className="kombai-btn min-h-16" onClick={onOpenDetail}>
          <Search size={17} />
          Ver analise completa
        </button>
        <button className="kombai-btn kombai-btn-solid min-h-16" onClick={onSimulate}>
          <Calculator size={17} />
          Simular lucro
        </button>
      </div>
    </article>
  );
}

function ResultRow({ item, rank, selected, onClick }: { item: RecommendationItem; rank: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/28 ${
        selected ? "border-cyan-300/35 bg-cyan-300/[0.08]" : "border-white/10 bg-white/[0.035]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-sm font-black text-slate-500">#{rank}</span>
            <span className="kombai-chip kombai-chip-orange">{item.product.marketplace_label}</span>
          </div>
          <div className="flex min-w-0 gap-3">
            <ProductImage product={item.product} className="h-14 w-14" />
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-white">{item.product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{item.explanation}</p>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:min-w-[300px] sm:grid-cols-4">
          <MiniMetric label="Score" value={item.opportunity_score.toFixed(0)} />
          <MiniMetric label="Margem" value={percent(item.estimated_margin_percent)} />
          <MiniMetric label="Lucro" value={brl.format(item.estimated_profit)} />
          <MiniMetric label="Risco" value={riskLabel(item.risk_score)} />
        </div>
      </div>
    </button>
  );
}

function HeroMetric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="border-white/10 p-4 text-center md:border-r md:p-5 md:last:border-r-0">
      <p className={`font-mono text-2xl font-black md:text-3xl ${tone}`}>{value}</p>
      <p className="mt-2 text-[11px] font-black uppercase text-slate-500">{label}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
      <p className="text-[10px] font-black uppercase text-slate-600">{label}</p>
      <p className="mt-1 font-mono text-sm font-black text-white">{value}</p>
    </div>
  );
}

function InsightBox({ icon, title, text, tone }: { icon: ReactNode; title: string; text: string; tone: "violet" | "cyan" }) {
  return (
    <div className={`rounded-lg border p-5 ${tone === "violet" ? "border-violet/25 bg-violet/[0.08]" : "border-cyan-300/20 bg-cyan-300/[0.055]"}`}>
      <div className={`mb-3 flex items-center gap-2 text-xs font-black uppercase ${tone === "violet" ? "text-violet-300" : "text-cyan-200"}`}>
        {icon}
        {title}
      </div>
      <p className="text-sm leading-7 text-slate-400">{text}</p>
    </div>
  );
}

function ProfileChip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "cyan" | "green" | "orange" | "violet" }) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
      : tone === "green"
        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
        : tone === "orange"
          ? "border-orange-300/30 bg-orange-300/10 text-orange-200"
          : tone === "violet"
            ? "border-violet/35 bg-violet/15 text-violet-200"
            : "border-white/10 bg-white/[0.035] text-slate-300";
  return <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black md:text-sm ${toneClass}`}>{children}</span>;
}

function riskLabel(score: number) {
  if (score < 35) return "Baixo";
  if (score < 65) return "Medio";
  return "Alto";
}

function competitionLabel(score: number) {
  if (score < 35) return "Baixa";
  if (score < 65) return "Moderada";
  return "Alta";
}

function shortGoal(label: string) {
  return label.replace("Boa margem e alta conversao", "Maior lucro").replace("Ate", "Ate");
}
