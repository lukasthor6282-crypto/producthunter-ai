import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarClock,
  History,
  PackageSearch,
  RefreshCw,
  Sparkles,
  Store,
  Tags,
  TrendingUp,
  Trophy,
  WalletCards,
} from "lucide-react";
import { useMemo } from "react";
import type { ReactNode } from "react";

import type { PageKey } from "../components/layout/Sidebar";
import { ProductImage } from "../components/product/ProductImage";
import { useRecommendationHistory } from "../hooks/useRecommendationHistory";
import { brl, percent } from "../services/format";
import type {
  RecommendationHistoryItem,
  RecommendationHistoryProduct,
  RecommendationInsightBucket,
  RecommendationInsights,
  RecommendationTopProductInsight,
} from "../types/recommendation";
import { profileOptionLabel } from "../types/userProfile";

type RecommendationHistoryProps = {
  onNavigate: (page: PageKey) => void;
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function RecommendationHistoryPage({ onNavigate }: RecommendationHistoryProps) {
  const { items, usage, insights, isLoading, isFetching, error, refetch } = useRecommendationHistory(30);

  const summary = useMemo(() => {
    const productCount = items.reduce((total, run) => total + (run.items?.length ?? 0), 0);
    const bestScore = items.reduce((best, run) => Math.max(best, run.top_opportunity_score ?? 0), 0);
    return { productCount, bestScore };
  }, [items]);

  const usagePercent = usage?.monthly_limit ? Math.min(100, (usage.generated_count / usage.monthly_limit) * 100) : 0;

  return (
    <div className="min-h-screen py-8">
      <header className="kombai-topbar -mx-4 flex flex-col justify-center gap-4 px-4 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">
              <History size={14} />
              Historico
            </span>
            <h1 className="mt-4 text-[1.7rem] font-black leading-tight text-white md:text-4xl">
              Recomendacoes salvas
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500 md:text-base">
              Toda simulacao feita pelo cliente fica registrada aqui com o perfil usado, os produtos recomendados e o limite mensal consumido.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="kombai-btn" onClick={() => void refetch()} disabled={isFetching}>
              <RefreshCw size={16} className={isFetching ? "animate-spin" : undefined} />
              Atualizar
            </button>
            <button type="button" className="kombai-btn kombai-btn-solid" onClick={() => onNavigate("profile")}>
              <Sparkles size={16} />
              Nova analise
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 py-7">
        <section className="grid gap-4 md:grid-cols-3">
          <SummaryMetric
            icon={<CalendarClock size={20} />}
            label="Analises salvas"
            value={items.length.toString()}
            detail={isLoading ? "Carregando historico" : "Rodadas registradas na conta"}
          />
          <SummaryMetric
            icon={<PackageSearch size={20} />}
            label="Produtos salvos"
            value={summary.productCount.toString()}
            detail="Itens recomendados dentro das analises"
          />
          <SummaryMetric
            icon={<TrendingUp size={20} />}
            label="Melhor score"
            value={summary.bestScore ? Math.round(summary.bestScore).toString() : "--"}
            detail="Maior oportunidade encontrada"
          />
        </section>

        <section className="kombai-card kombai-card-green p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
                <WalletCards size={20} />
              </span>
              <div>
                <h2 className="text-lg font-black text-white">Uso mensal de recomendacoes</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {usage
                    ? `${usage.generated_count} de ${usage.monthly_limit} analises usadas no periodo ${usage.period_month}.`
                    : "Buscando consumo do plano..."}
                </p>
              </div>
            </div>
            <div className="min-w-[180px]">
              <p className="text-right font-mono text-3xl font-black text-white">{usage?.remaining ?? "--"}</p>
              <p className="text-right text-xs font-black uppercase tracking-[0.12em] text-slate-500">restantes</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-[width] duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </section>

        <RecommendationInsightsPanel insights={insights} isLoading={isLoading} />

        {error ? (
          <section className="kombai-card border-ember/30 bg-ember/10 p-6">
            <span className="kombai-chip kombai-chip-orange">Erro no historico</span>
            <h2 className="mt-4 text-xl font-black text-white">Nao foi possivel carregar os itens salvos</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{error}</p>
            <button type="button" className="kombai-btn mt-5" onClick={() => void refetch()}>
              Tentar novamente
            </button>
          </section>
        ) : isLoading ? (
          <HistorySkeleton />
        ) : items.length === 0 ? (
          <EmptyHistory onNavigate={onNavigate} />
        ) : (
          <section className="space-y-4">
            {items.map((run, index) => (
              <motion.div
                key={run.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                transition={{ delay: index * 0.04, duration: 0.22 }}
              >
                <HistoryRunCard run={run} />
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="kombai-card kombai-card-soft p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          {icon}
        </span>
        <span className="kombai-chip kombai-chip-cyan">{label}</span>
      </div>
      <p className="mt-6 font-mono text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-semibold text-slate-500">{detail}</p>
    </article>
  );
}

function RecommendationInsightsPanel({ insights, isLoading }: { insights: RecommendationInsights | null; isLoading: boolean }) {
  if (isLoading && !insights) {
    return (
      <section className="kombai-card p-5">
        <div className="shimmer h-7 w-56 rounded-lg bg-white/10" />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="shimmer h-40 rounded-lg bg-white/10" />
          <div className="shimmer h-40 rounded-lg bg-white/10" />
          <div className="shimmer h-40 rounded-lg bg-white/10" />
        </div>
      </section>
    );
  }

  if (!insights || insights.total_saved_products === 0) {
    return (
      <section className="kombai-card p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
            <BarChart3 size={20} />
          </span>
          <div>
            <h2 className="text-lg font-black text-white">Inteligencia do banco</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Gere algumas recomendacoes para o banco revelar nichos, marketplaces e produtos mais fortes para esta conta.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kombai-card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
            <BarChart3 size={20} />
          </span>
          <div>
            <h2 className="text-lg font-black text-white">Inteligencia do banco de recomendacoes</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Agregacao das analises salvas para mostrar onde a conta esta encontrando mais oportunidade.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right">
          <RunMetric label="score medio" value={Math.round(insights.average_opportunity_score).toString()} tone="cyan" />
          <RunMetric label="melhor score" value={Math.round(insights.best_opportunity_score).toString()} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_0.8fr_1.4fr]">
        <InsightList
          icon={<Tags size={18} />}
          title="Top nichos"
          items={insights.top_niches}
          empty="Sem nichos ainda"
        />
        <InsightList
          icon={<Store size={18} />}
          title="Top marketplaces"
          items={insights.top_marketplaces}
          empty="Sem marketplaces ainda"
        />
        <TopProductsInsight products={insights.top_products} />
      </div>
    </section>
  );
}

function InsightList({
  icon,
  title,
  items,
  empty,
}: {
  icon: ReactNode;
  title: string;
  items: RecommendationInsightBucket[];
  empty: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-cyan-200">
          {icon}
        </span>
        <h3 className="font-black text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.length ? (
          items.map((item) => <InsightBucketRow key={item.key} item={item} />)
        ) : (
          <p className="text-sm font-semibold text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  );
}

function InsightBucketRow({ item }: { item: RecommendationInsightBucket }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-black text-white">{item.label}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{item.total_recommendations} recomendacoes</p>
        </div>
        <span className="font-mono text-xl font-black text-cyan-200">{Math.round(item.average_opportunity_score)}</span>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-500">
        Lucro medio {brl.format(item.average_estimated_profit)} - melhor score {Math.round(item.best_opportunity_score)}
      </p>
    </div>
  );
}

function TopProductsInsight({ products }: { products: RecommendationTopProductInsight[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-cyan-200">
          <Trophy size={18} />
        </span>
        <h3 className="font-black text-white">Produtos recorrentes</h3>
      </div>
      <div className="space-y-3">
        {products.length ? (
          products.map((product) => <TopProductInsightRow key={`${product.product_id}-${product.marketplace}`} product={product} />)
        ) : (
          <p className="text-sm font-semibold text-slate-500">Sem produtos recorrentes ainda</p>
        )}
      </div>
    </div>
  );
}

function TopProductInsightRow({ product }: { product: RecommendationTopProductInsight }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <div className="grid gap-3 sm:grid-cols-[52px_1fr_auto] sm:items-center">
        <ProductImage product={{ name: product.product_name, image_url: product.image_url }} className="h-14 w-14" />
        <div className="min-w-0">
          <p className="truncate font-black text-white">{product.product_name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-orange-500/15 px-2 py-1 text-[11px] font-black text-orange-300">
              {product.marketplace_label}
            </span>
            <span className="rounded-md bg-emerald-500/12 px-2 py-1 text-[11px] font-black text-emerald-200">
              {product.niche_label}
            </span>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-xl font-black text-cyan-200">{Math.round(product.average_opportunity_score)}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
            {product.appearances}x
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryRunCard({ run }: { run: RecommendationHistoryItem }) {
  const topProducts = (run.items ?? []).slice(0, 5);
  const profile = run.profile;

  return (
    <article className="kombai-card p-4 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="kombai-chip kombai-chip-cyan">
              <CalendarClock size={14} />
              {formatDateTime(run.created_at)}
            </span>
            <span className="kombai-chip kombai-chip-orange">{profileOptionLabel("marketplace", profile.marketplace)}</span>
            <span className="kombai-chip kombai-chip-green">{profileOptionLabel("niche", profile.niche)}</span>
            <span className="kombai-chip">{profileOptionLabel("investment_range", profile.investment_range)}</span>
          </div>
          <h2 className="mt-4 truncate text-xl font-black text-white md:text-2xl">
            {run.top_product_name ?? "Analise sem produto recomendado"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            {profileOptionLabel("operation_type", profile.operation_type)} buscando {profileOptionLabel("goal", profile.goal).toLowerCase()} com{" "}
            {profileOptionLabel("traffic_type", profile.traffic_type).toLowerCase()}.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[360px]">
          <RunMetric label="score top" value={run.top_opportunity_score ? Math.round(run.top_opportunity_score).toString() : "--"} tone="cyan" />
          <RunMetric label="produtos" value={run.returned_count.toString()} />
          <RunMetric label="candidatos" value={run.total_candidates.toString()} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {topProducts.length ? (
          topProducts.map((product) => <HistoryProductRow key={`${run.id}-${product.rank}-${product.product_id}`} product={product} />)
        ) : (
          <div className="data-row p-4 text-sm font-semibold text-slate-500">
            Nenhum produto foi salvo nessa analise. Gere uma nova recomendacao com filtros mais amplos.
          </div>
        )}
      </div>
    </article>
  );
}

function RunMetric({ label, value, tone = "default" }: { label: string; value: string; tone?: "cyan" | "default" }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <p className={tone === "cyan" ? "font-mono text-2xl font-black text-cyan-200" : "font-mono text-2xl font-black text-white"}>{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
    </div>
  );
}

function HistoryProductRow({ product }: { product: RecommendationHistoryProduct }) {
  return (
    <div className={product.rank === 1 ? "data-row-highlight p-4" : "data-row p-4"}>
      <div className="grid gap-4 md:grid-cols-[44px_64px_1fr_96px_96px_96px] md:items-center">
        <span className="font-mono text-sm font-black text-slate-500">#{product.rank}</span>
        <ProductImage product={{ name: product.product_name, image_url: product.image_url }} className="h-16 w-16" />
        <div className="min-w-0">
          <p className="truncate font-black text-white">{product.product_name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-orange-500/15 px-2 py-1 text-[11px] font-black text-orange-300">
              {product.marketplace_label}
            </span>
            <span className="rounded-md bg-emerald-500/12 px-2 py-1 text-[11px] font-black text-emerald-200">
              {product.niche_label}
            </span>
            {product.product_url && (
              <a
                href={product.product_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-cyan-300/10 px-2 py-1 text-[11px] font-black text-cyan-200 transition hover:bg-cyan-300/16"
              >
                Ver produto
              </a>
            )}
          </div>
        </div>
        <ProductMetric label="preco" value={brl.format(product.average_price)} />
        <ProductMetric label="margem" value={percent(product.estimated_margin_percent)} tone="green" />
        <ProductMetric label="score" value={Math.round(product.opportunity_score).toString()} tone="cyan" />
      </div>
    </div>
  );
}

function ProductMetric({ label, value, tone = "default" }: { label: string; value: string; tone?: "cyan" | "green" | "default" }) {
  const toneClass = tone === "cyan" ? "text-cyan-200" : tone === "green" ? "text-mint" : "text-white";
  return (
    <div className="text-left md:text-right">
      <p className={`font-mono text-xl font-black ${toneClass}`}>{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <section className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="kombai-card p-5">
          <div className="shimmer h-6 w-48 rounded-lg bg-white/10" />
          <div className="shimmer mt-5 h-8 w-2/3 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            <div className="shimmer h-20 rounded-lg bg-white/10" />
            <div className="shimmer h-20 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </section>
  );
}

function EmptyHistory({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <section className="kombai-card p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
        <PackageSearch size={24} />
      </span>
      <h2 className="mt-5 text-2xl font-black text-white">Nenhum item recomendado salvo ainda</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
        Quando o cliente gerar uma recomendacao, a analise e os produtos encontrados vao aparecer aqui automaticamente.
      </p>
      <button type="button" className="kombai-btn kombai-btn-solid mt-6" onClick={() => onNavigate("profile")}>
        <Sparkles size={16} />
        Gerar primeira analise
      </button>
    </section>
  );
}
