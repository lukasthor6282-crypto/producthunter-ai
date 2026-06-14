import {
  Activity,
  ArrowRight,
  Bell,
  Boxes,
  BrainCircuit,
  CircleDollarSign,
  Flame,
  Gauge,
  LineChart,
  PackageCheck,
  Radar,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { OpportunityRadar } from "../components/dashboard/OpportunityRadar";
import { ProductImage } from "../components/product/ProductImage";
import { useProducts } from "../hooks/useProducts";
import { percent } from "../services/format";
import type { Product } from "../types/product";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const trendSeries = Array.from({ length: 30 }, (_, index) => ({
  day: `${index + 1}/5`,
  tecnologia: 68 + index * 0.75 + Math.sin(index * 1.2) * 3,
  beleza: 55 + index * 1.12 + Math.sin(index * 1.35) * 2.5,
  casa: 50 + index * 0.82 + Math.sin(index * 1.4) * 2,
  automotivo: 58 + index * 0.96 + Math.sin(index * 1.22) * 2.4,
}));

const fallbackProducts = [
  {
    name: "Suporte veicular magnetico",
    marketplace_label: "Shopee",
    niche_label: "Automotivo",
    trend_score: 87,
    average_price: 89,
    estimated_cost: 55,
    return_risk: 18,
    image_url: null,
  },
  {
    name: "Aspirador automotivo compacto",
    marketplace_label: "Amazon",
    niche_label: "Automotivo",
    trend_score: 82,
    average_price: 169,
    estimated_cost: 113,
    return_risk: 33,
    image_url: null,
  },
  {
    name: "Organizador de porta-malas",
    marketplace_label: "Mercado Livre",
    niche_label: "Automotivo",
    trend_score: 79,
    average_price: 79,
    estimated_cost: 51,
    return_risk: 36,
    image_url: null,
  },
  {
    name: "Mini camera veicular",
    marketplace_label: "Shopee",
    niche_label: "Automotivo",
    trend_score: 74,
    average_price: 119,
    estimated_cost: 84,
    return_risk: 42,
    image_url: null,
  },
  {
    name: "Kit limpeza automotiva",
    marketplace_label: "Amazon",
    niche_label: "Automotivo",
    trend_score: 71,
    average_price: 96,
    estimated_cost: 54,
    return_risk: 29,
    image_url: null,
  },
] as const;

const marketSignals = [
  { label: "Demanda", value: "Subindo", detail: "+18% nos produtos monitorados", tone: "mint" },
  { label: "Concorrencia", value: "Moderada", detail: "bom espaco para validacao", tone: "amber" },
  { label: "Verba ideal", value: "R$ 480", detail: "teste inicial recomendado", tone: "cyan" },
] as const;

type DashboardProduct = Product | (typeof fallbackProducts)[number];

export function Dashboard() {
  const { products, isLoading } = useProducts(60);

  const productSource = useMemo<DashboardProduct[]>(() => (products.length ? products : [...fallbackProducts]), [products]);

  const topProducts = useMemo<DashboardProduct[]>(() => {
    return [...productSource].sort((a, b) => b.trend_score - a.trend_score).slice(0, 5);
  }, [productSource]);

  const summary = useMemo(() => buildDashboardSummary(productSource), [productSource]);

  const scatterData = useMemo(() => {
    return productSource.slice(0, 18).map((product) => ({
      name: product.name,
      margin: marginPercent(product),
      risk: product.return_risk,
    }));
  }, [productSource]);

  const leadingProduct = topProducts[0];

  return (
    <div className="dashboard-premium min-h-screen pb-8">
      <header className="dashboard-command relative -mx-3 overflow-hidden border-b border-white/[0.08] px-3 pb-6 pt-4 sm:-mx-4 sm:px-4 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
        <div className="dashboard-scanline" />
        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <section className="dashboard-command-panel">
            <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-6 lg:p-7">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div>
                  <p className="dashboard-kicker">
                    <Radar size={15} />
                    ProductHunter Command Desk
                  </p>
                  <h1 className="font-display mt-4 max-w-3xl text-[2.45rem] font-bold leading-[1.02] text-white sm:text-5xl xl:text-[4.45rem]">
                    Onde apostar hoje.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                    Um painel para transformar nicho, margem, risco e demanda em decisao de produto antes de comprar estoque ou subir campanha.
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <button className="dashboard-icon-button" aria-label="Alertas">
                    <Bell size={17} />
                  </button>
                  <button className="dashboard-primary-action">
                    <Zap size={16} />
                    Nova analise
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {marketSignals.map((signal) => (
                  <SignalTile key={signal.label} {...signal} />
                ))}
              </div>
            </div>
          </section>

          <aside className="dashboard-decision-stack">
            <div className="relative z-10 flex h-full flex-col gap-6 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100/70">Decision stack</p>
                  <h2 className="font-display mt-2 text-2xl font-bold text-white">{summary.topNiche}</h2>
                  <p className="mt-2 max-w-[19rem] text-sm leading-6 text-slate-400">
                    Prioridade calculada por score, margem e risco medio dos produtos ativos.
                  </p>
                </div>
                <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-xs font-black text-mint">
                  live
                </span>
              </div>

              <div className="grid grid-cols-[auto_1fr] items-center gap-5">
                <div className="dashboard-score-dial" style={{ "--score": summary.averageScore } as CSSProperties}>
                  <span>{summary.averageScore}</span>
                  <small>score</small>
                </div>
                <div className="space-y-3">
                  <DecisionMetric icon={<Gauge size={15} />} label="Margem media" value={percent(summary.averageMargin)} />
                  <DecisionMetric icon={<ShieldCheck size={15} />} label="Risco medio" value={`${summary.averageRisk}/100`} />
                  <DecisionMetric icon={<PackageCheck size={15} />} label="Produto lider" value={leadingProduct?.name ?? "Aguardando dados"} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <div className="space-y-5 py-6">
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStat icon={<Boxes size={21} />} value={summary.totalProducts} label="Produtos lidos" detail="base monitorada" badge={isLoading ? "sync" : "ao vivo"} tone="cyan" />
          <DashboardStat icon={<Target size={21} />} value={`${summary.averageScore}/100`} label="Score medio" detail="potencial comercial" badge="+12%" tone="mint" />
          <DashboardStat icon={<CircleDollarSign size={21} />} value={percent(summary.bestMargin)} label="Melhor margem" detail="produto no topo" badge={currency.format(summary.bestProfit)} tone="amber" />
          <DashboardStat icon={<BrainCircuit size={21} />} value={summary.topNiche} label="Nicho em foco" detail={summary.topMarketplace} badge="IA" tone="violet" />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.34fr_0.86fr]">
          <div className="dashboard-panel p-4 sm:p-5">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="dashboard-section-label">
                  <LineChart size={14} />
                  Mercado em movimento
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold text-white">Tendencia por nicho</h2>
                <p className="mt-1 text-sm text-slate-500">Leitura semanal dos mercados com maior atividade no radar.</p>
              </div>
              <select className="kombai-input h-10 rounded-lg px-3 text-sm font-bold text-slate-300">
                <option>30 dias</option>
                <option>7 dias</option>
                <option>90 dias</option>
              </select>
            </div>

            <div className="h-[300px] md:h-[442px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendSeries} margin={{ left: -14, right: 8, top: 14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashTrendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.015} />
                    </linearGradient>
                    <linearGradient id="dashTrendMint" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#5ef2b0" stopOpacity={0.16} />
                      <stop offset="100%" stopColor="#5ef2b0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.11)" strokeDasharray="4 8" />
                  <XAxis dataKey="day" interval={4} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(7,11,17,0.96)", border: "1px solid rgba(103,232,249,0.22)", borderRadius: 8, color: "#fff", boxShadow: "0 22px 70px rgba(0,0,0,0.45)" }} />
                  <Area type="monotone" dataKey="tecnologia" stroke="#67e8f9" strokeWidth={3} fill="url(#dashTrendFill)" />
                  <Area type="monotone" dataKey="automotivo" stroke="#5ef2b0" strokeWidth={3} fill="url(#dashTrendMint)" />
                  <Area type="monotone" dataKey="beleza" stroke="#f6b35b" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="casa" stroke="#a78bfa" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <OpportunityRadar
            score={summary.averageScore}
            title="Opportunity Radar"
            subtitle="Compatibilidade entre nicho, verba, margem, demanda, risco e conversao."
            signals={[
              { label: "Nicho", value: 91, tone: "mint" },
              { label: "Verba", value: 84, tone: "cyan" },
              { label: "Margem", value: Math.round(summary.averageMargin), tone: "mint" },
              { label: "Demanda", value: 86, tone: "violet" },
              { label: "Risco", value: Math.max(8, 100 - summary.averageRisk), tone: "amber" },
              { label: "Conversao", value: 73, tone: "cyan" },
            ]}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <div className="dashboard-panel p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="dashboard-section-label">
                  <Flame size={14} />
                  Lista priorizada
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold text-white">Top oportunidades</h2>
                <p className="mt-1 text-sm text-slate-500">{isLoading ? "Carregando produtos..." : "Produtos com maior score agora"}</p>
              </div>
              <button className="dashboard-link-button">
                Ver todos
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <OpportunityRow key={`${product.name}-${index}`} product={product} rank={index + 1} />
              ))}
            </div>
          </div>

          <div className="dashboard-panel p-4 sm:p-5">
            <p className="dashboard-section-label">
              <Activity size={14} />
              Quadrante de risco
            </p>
            <h2 className="font-display mt-3 text-2xl font-bold text-white">Risco x Margem</h2>
            <p className="mt-1 text-sm text-slate-500">O melhor ponto combina margem alta e baixo risco operacional.</p>
            <div className="mt-5 h-[260px] md:h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: -16, right: 18, top: 18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.11)" strokeDasharray="4 8" />
                  <XAxis type="number" dataKey="margin" name="Margem" unit="%" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="risk" name="Risco" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "rgba(7,11,17,0.96)", border: "1px solid rgba(103,232,249,0.22)", borderRadius: 8, color: "#fff", boxShadow: "0 22px 70px rgba(0,0,0,0.45)" }} />
                  <Scatter data={scatterData} fill="#67e8f9" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.15fr_0.95fr]">
          <div className="dashboard-panel p-5">
            <h2 className="font-display text-xl font-bold text-white">Nichos em alta</h2>
            <div className="mt-5 space-y-4">
              {summary.nicheMomentum.map((item) => (
                <NicheBar key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          <div className="dashboard-panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">Alertas de decisao</h2>
              <span className="kombai-chip kombai-chip-orange">2 novos</span>
            </div>
            <div className="mt-5 space-y-3">
              <AlertRow title="Concorrencia subindo em eletronicos baratos" detail="Evite escala antes de validar criativo e prazo de entrega." />
              <AlertRow title="Margem pressionada em itens de ticket baixo" detail="Priorize combos ou kits para proteger lucro unitario." />
              <AlertRow title="Boa janela em acessorios automotivos" detail="Demanda alta com risco operacional controlado." positive />
            </div>
          </div>

          <div className="dashboard-panel dashboard-panel-mint p-5">
            <h2 className="font-display text-xl font-bold text-white">IA Score Global</h2>
            <p className="mt-1 text-sm text-slate-500">Analise de hoje</p>
            <div className="mt-8 flex items-end gap-2">
              <span className="font-mono text-6xl font-black text-white">{summary.averageScore}</span>
              <span className="pb-2 text-lg font-black text-slate-500">/100</span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Mercado favoravel para testar produtos com ticket acessivel, margem acima da media e fornecedor confiavel.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="kombai-chip kombai-chip-green">Favoravel</span>
              <span className="kombai-chip kombai-chip-cyan">{summary.topNiche}</span>
              <span className="kombai-chip">Risco medio</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardStat({ icon, value, label, detail, badge, tone }: { icon: ReactNode; value: string | number; label: string; detail: string; badge: string; tone: "cyan" | "mint" | "amber" | "violet" }) {
  return (
    <article className={`dashboard-stat dashboard-stat-${tone}`}>
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span className="dashboard-stat-icon">{icon}</span>
        <span className="dashboard-stat-badge">{badge}</span>
      </div>
      <p className="relative z-10 mt-5 font-mono text-3xl font-black text-white md:text-4xl">{value}</p>
      <p className="relative z-10 mt-1 text-sm font-bold text-slate-300">{label}</p>
      <p className="relative z-10 mt-1 text-sm text-slate-500">{detail}</p>
    </article>
  );
}

function SignalTile({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "cyan" | "mint" | "amber" }) {
  return (
    <div className={`dashboard-signal dashboard-signal-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function DecisionMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.045] px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-100">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="w-full max-w-[13rem] truncate text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function OpportunityRow({ product, rank }: { product: DashboardProduct; rank: number }) {
  const margin = marginPercent(product);
  const score = Math.round(product.trend_score);

  return (
    <div className={rank === 1 ? "dashboard-product-row dashboard-product-row-highlight" : "dashboard-product-row"}>
      <div className="grid items-center gap-4 md:grid-cols-[42px_58px_1fr_76px_76px]">
        <span className="font-mono text-sm font-black text-slate-600">#{rank}</span>
        <ProductImage product={product} className="h-14 w-14" />
        <div className="min-w-0">
          <p className="truncate font-black text-white">{product.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-orange-500/15 px-2 py-1 text-[11px] font-black text-orange-300">{product.marketplace_label}</span>
            <span className="rounded-md bg-cyan-300/[0.08] px-2 py-1 text-[11px] font-black text-cyan-100">{product.niche_label}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-black text-mint">{score}</p>
          <p className="text-[10px] font-bold text-slate-500">score</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-black text-white">{percent(margin)}</p>
          <p className="text-[10px] font-bold text-slate-500">margem</p>
        </div>
      </div>
    </div>
  );
}

function NicheBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold text-slate-300">{label}</span>
        <span className="font-mono font-black text-cyan-200">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.055]">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#67e8f9,#5ef2b0)]" style={{ width: `${Math.max(12, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function AlertRow({ title, detail, positive = false }: { title: string; detail: string; positive?: boolean }) {
  return (
    <div className="dashboard-alert-row">
      <span className={positive ? "mt-1 text-mint" : "mt-1 text-amber-300"}>
        {positive ? <Flame size={15} /> : <Bell size={15} />}
      </span>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function buildDashboardSummary(products: DashboardProduct[]) {
  const totalProducts = products.length;
  const margins = products.map(marginPercent);
  const scores = products.map((product) => product.trend_score);
  const risks = products.map((product) => product.return_risk);
  const bestProduct = [...products].sort((a, b) => marginPercent(b) - marginPercent(a))[0];

  return {
    totalProducts,
    averageScore: Math.round(average(scores) || 78),
    averageMargin: average(margins) || 38,
    averageRisk: Math.round(average(risks) || 32),
    bestMargin: Math.max(...margins, 0),
    bestProfit: bestProduct ? Math.max(0, bestProduct.average_price - bestProduct.estimated_cost) : 0,
    topNiche: mostCommon(products.map((product) => product.niche_label)) ?? "Automotivo",
    topMarketplace: mostCommon(products.map((product) => product.marketplace_label)) ?? "Shopee",
    nicheMomentum: buildNicheMomentum(products),
  };
}

function marginPercent(product: DashboardProduct) {
  return product.average_price ? ((product.average_price - product.estimated_cost) / product.average_price) * 100 : 0;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function mostCommon(values: string[]) {
  if (!values.length) return null;

  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function buildNicheMomentum(products: DashboardProduct[]) {
  const scores = new Map<string, number[]>();
  products.forEach((product) => {
    const values = scores.get(product.niche_label) ?? [];
    values.push(product.trend_score);
    scores.set(product.niche_label, values);
  });

  const rows = [...scores.entries()]
    .map(([label, values]) => ({ label, value: Math.round(average(values)) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (rows.length >= 5) return rows;
  return [
    ...rows,
    { label: "Automotivo", value: 88 },
    { label: "Tecnologia", value: 84 },
    { label: "Casa", value: 78 },
    { label: "Games", value: 73 },
    { label: "Ferramentas", value: 69 },
  ].filter((item, index, array) => array.findIndex((candidate) => candidate.label === item.label) === index).slice(0, 5);
}
