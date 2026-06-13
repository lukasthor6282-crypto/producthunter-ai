import { Bell, Boxes, Flame, Target, TrendingUp, Zap } from "lucide-react";
import { useMemo } from "react";
import type { ReactNode } from "react";
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
    name: "Mini impressora termica",
    marketplace_label: "Amazon",
    niche_label: "Tecnologia",
    trend_score: 82,
    average_price: 149,
    estimated_cost: 84,
    return_risk: 22,
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
    name: "Fone TWS X12",
    marketplace_label: "Shopee",
    niche_label: "Tecnologia",
    trend_score: 74,
    average_price: 119,
    estimated_cost: 84,
    return_risk: 42,
    image_url: null,
  },
  {
    name: "Aspirador automotivo compacto",
    marketplace_label: "Amazon",
    niche_label: "Automotivo",
    trend_score: 71,
    average_price: 169,
    estimated_cost: 113,
    return_risk: 33,
    image_url: null,
  },
] as const;

type DashboardProduct = Product | (typeof fallbackProducts)[number];

export function Dashboard() {
  const { products, isLoading } = useProducts(60);

  const topProducts = useMemo<DashboardProduct[]>(() => {
    if (!products.length) return [...fallbackProducts];
    return [...products].sort((a, b) => b.trend_score - a.trend_score).slice(0, 5);
  }, [products]);

  const scatterData = useMemo(() => {
    const source = products.length ? products.slice(0, 18) : fallbackProducts;
    return source.map((product) => ({
      name: product.name,
      margin: product.average_price ? ((product.average_price - product.estimated_cost) / product.average_price) * 100 : 0,
      risk: product.return_risk,
    }));
  }, [products]);

  return (
    <div className="min-h-screen">
      <header className="kombai-topbar -mx-4 flex items-center justify-between gap-4 px-4 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            ProductHunter <span className="mx-2 text-slate-700">/</span>
            <span className="font-black text-white">Cockpit</span>
          </p>
          <h1 className="font-display mt-2 text-[1.8rem] font-bold leading-tight text-white md:text-4xl">
            Cockpit de Oportunidades
          </h1>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm font-semibold text-slate-500">Radar atualizado</span>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.035] text-slate-400">
            <Bell size={17} />
          </button>
          <button className="kombai-btn">
            <Zap size={16} />
            Nova analise
          </button>
        </div>
      </header>

      <div className="space-y-6 py-7">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStat icon={<Zap size={22} />} value="1,204" label="Oportunidades" detail="esta semana" badge="+12%" />
          <DashboardStat icon={<Target size={22} />} value="84/100" label="Score Medio" detail="radar global" badge="84" />
          <DashboardStat icon={<TrendingUp size={22} />} value="42.5%" label="Melhor Margem" detail="nicho destaque" badge="Tech" />
          <DashboardStat icon={<Boxes size={22} />} value="3 ativos" label="Nichos em analise" detail="ML, Amazon e Shopee" badge="Ao vivo" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
          <section className="kombai-card p-5">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Tendencia por nicho</h2>
                <p className="mt-1 text-sm text-slate-500">Evolucao semanal dos principais mercados monitorados.</p>
              </div>
              <select className="kombai-input h-9 px-3 text-sm font-semibold text-slate-300">
                <option>30 dias</option>
                <option>7 dias</option>
                <option>90 dias</option>
              </select>
            </div>
            <div className="h-[300px] md:h-[460px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendSeries} margin={{ left: -14, right: 8, top: 14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashTrendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" strokeDasharray="4 6" />
                  <XAxis dataKey="day" interval={4} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(12,15,20,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff" }} />
                  <Area type="monotone" dataKey="tecnologia" stroke="#67e8f9" strokeWidth={3} fill="url(#dashTrendFill)" />
                  <Area type="monotone" dataKey="beleza" stroke="#5ef2b0" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="casa" stroke="#f6b35b" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="automotivo" stroke="#a78bfa" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <OpportunityRadar
            score={84}
            title="Opportunity Radar"
            subtitle="Compatibilidade entre nicho, verba, margem, demanda, risco e conversao."
            signals={[
              { label: "Nicho", value: 91, tone: "mint" },
              { label: "Verba", value: 84, tone: "cyan" },
              { label: "Margem", value: 78, tone: "mint" },
              { label: "Demanda", value: 86, tone: "violet" },
              { label: "Risco", value: 64, tone: "amber" },
              { label: "Conversao", value: 73, tone: "cyan" },
            ]}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <section className="kombai-card p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Top oportunidades</h2>
                <p className="mt-1 text-sm text-slate-500">{isLoading ? "Carregando produtos..." : "Produtos com maior score agora"}</p>
              </div>
              <button className="text-sm font-black text-cyan-200">Ver todos</button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <OpportunityRow key={`${product.name}-${index}`} product={product} rank={index + 1} />
              ))}
            </div>
          </section>

          <section className="kombai-card p-5">
            <h2 className="font-display text-xl font-bold text-white">Risco x Margem</h2>
            <p className="mt-1 text-sm text-slate-500">O quadrante ideal fica em alta margem e baixo risco.</p>
            <div className="mt-5 h-[260px] md:h-[310px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: -16, right: 18, top: 18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" />
                  <XAxis type="number" dataKey="margin" name="Margem" unit="%" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="risk" name="Risco" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "rgba(12,15,20,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff" }} />
                  <Scatter data={scatterData} fill="#67e8f9" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr_0.9fr]">
          <section className="kombai-card p-5">
            <h2 className="font-display text-xl font-bold text-white">Nichos em alta</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Tecnologia", 92],
                ["Automotivo", 88],
                ["Beleza", 87],
                ["Games", 83],
                ["Casa", 74],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">{label}</span>
                  <span className="font-mono font-black text-cyan-200">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="kombai-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">Alertas</h2>
              <span className="kombai-chip kombai-chip-orange">2 novos</span>
            </div>
            <div className="mt-5 space-y-3">
              <AlertRow title="Alta concorrencia em fones Bluetooth" detail="Novas lojas entrando no nicho, 2h atras" />
              <AlertRow title="Margem caindo em capas de celular" detail="-3.2% na ultima semana" />
              <AlertRow title="Boa oportunidade em suportes veiculares" detail="Demanda crescendo 28% agora" positive />
            </div>
          </section>

          <section className="kombai-card kombai-card-green p-5">
            <h2 className="font-display text-xl font-bold text-white">IA Score Global</h2>
            <p className="mt-1 text-sm text-slate-500">Analise de hoje</p>
            <div className="mt-8 flex items-end gap-2">
              <span className="font-mono text-6xl font-black text-white">78</span>
              <span className="pb-2 text-lg font-black text-slate-500">/100</span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Mercado aquecido, concorrencia moderada e boas margens em tecnologia, automotivo e beleza.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="kombai-chip kombai-chip-green">Favoravel</span>
              <span className="kombai-chip kombai-chip-cyan">Tech alta</span>
              <span className="kombai-chip">Risco medio</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({ icon, value, label, detail, badge }: { icon: ReactNode; value: string; label: string; detail: string; badge: string }) {
  return (
    <article className="kombai-card kombai-card-soft p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          {icon}
        </span>
        <span className="kombai-chip kombai-chip-green">{badge}</span>
      </div>
      <p className="mt-5 font-mono text-3xl font-black text-white md:mt-6 md:text-4xl">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </article>
  );
}

function OpportunityRow({ product, rank }: { product: DashboardProduct; rank: number }) {
  const margin = product.average_price ? ((product.average_price - product.estimated_cost) / product.average_price) * 100 : 0;
  const score = Math.round(product.trend_score);

  return (
    <div className={rank === 1 ? "data-row-highlight p-4" : "data-row p-4"}>
      <div className="grid items-center gap-4 md:grid-cols-[42px_58px_1fr_72px_72px]">
        <span className="font-mono text-sm font-black text-slate-600">#{rank}</span>
        <ProductImage product={product} className="h-14 w-14" />
        <div className="min-w-0">
          <p className="truncate font-black text-white">{product.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-orange-500/15 px-2 py-1 text-[11px] font-black text-orange-300">{product.marketplace_label}</span>
            <span className="text-xs font-semibold text-slate-500">{product.niche_label}</span>
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

function AlertRow({ title, detail, positive = false }: { title: string; detail: string; positive?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <span className={positive ? "mt-1 text-mint" : "mt-1 text-amber-300"}>
        {positive ? <Flame size={15} /> : <Bell size={15} />}
      </span>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
