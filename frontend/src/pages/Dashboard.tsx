import { Bell, Boxes, Flame, TrendingUp, Zap } from "lucide-react";
import { useMemo } from "react";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useProducts } from "../hooks/useProducts";
import { percent } from "../services/format";
import type { Product } from "../types/product";

const trendSeries = Array.from({ length: 30 }, (_, index) => ({
  day: `${index + 1}/5`,
  tecnologia: 68 + index * 0.75 + Math.sin(index * 1.2) * 3,
  beleza: 55 + index * 1.12 + Math.sin(index * 1.35) * 2.5,
  casa: 50 + index * 0.82 + Math.sin(index * 1.4) * 2,
  games: 61 + index * 0.78 + Math.sin(index * 1.18) * 2.7,
}));

const radarData = [
  { subject: "Volume", shopee: 88, amazon: 94, ml: 78 },
  { subject: "Margem", shopee: 66, amazon: 58, ml: 72 },
  { subject: "Concorrência", shopee: 48, amazon: 62, ml: 68 },
  { subject: "Taxas", shopee: 74, amazon: 56, ml: 52 },
  { subject: "Conversão", shopee: 82, amazon: 76, ml: 70 },
];

const fallbackProducts = [
  { name: "Mini Impressora Térmica", marketplace_label: "Shopee", niche_label: "Tecnologia", trend_score: 87, average_price: 89, estimated_cost: 55, return_risk: 18 },
  { name: "Suporte Magnético Gamer", marketplace_label: "Amazon", niche_label: "Tecnologia", trend_score: 82, average_price: 149, estimated_cost: 84, return_risk: 22 },
  { name: "LED Strip RGB Smart", marketplace_label: "Shopee", niche_label: "Games", trend_score: 79, average_price: 79, estimated_cost: 51, return_risk: 36 },
  { name: "Fone TWS X12", marketplace_label: "ML", niche_label: "Tecnologia", trend_score: 74, average_price: 119, estimated_cost: 84, return_risk: 42 },
  { name: "Webcam Full HD 1080p", marketplace_label: "Amazon", niche_label: "Tecnologia", trend_score: 71, average_price: 169, estimated_cost: 113, return_risk: 33 },
] as const;

export function Dashboard() {
  const { products, isLoading } = useProducts(60);

  const topProducts = useMemo(() => {
    if (!products.length) return fallbackProducts;
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
            <span className="font-black text-white">Dashboard</span>
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.01em] text-white md:text-3xl">Visão Geral do Mercado</h1>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm font-semibold text-slate-500">Sab, 31 Mai 2025</span>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.035] text-slate-400">
            <Bell size={17} />
          </button>
          <button className="kombai-btn">
            <Zap size={16} />
            Nova Análise
          </button>
        </div>
      </header>

      <div className="space-y-6 py-7">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStat icon={<Zap size={22} />} value="1,204" label="Oportunidades" detail="esta semana" badge="+12%" />
          <DashboardStat icon={<ScoreOrb />} value="84/100" label="Score Médio" detail="Mercado global" badge="84" />
          <DashboardStat icon={<TrendingUp size={22} />} value="42.5%" label="Melhor Margem Média" detail="nicho destaque" badge="Tecnologia" />
          <DashboardStat icon={<Boxes size={22} />} value="3 Ativos" label="Nichos em Análise" detail="ML · Amazon · Shopee" badge="Ao vivo" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.9fr_0.93fr]">
          <section className="kombai-card p-5">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white">Tendência por Nicho</h2>
                <p className="mt-1 text-sm text-slate-500">Evolução semanal dos principais nichos</p>
              </div>
              <select className="kombai-input h-9 px-3 text-sm font-semibold text-slate-300">
                <option>30 dias</option>
                <option>7 dias</option>
                <option>90 dias</option>
              </select>
            </div>
            <div className="h-[460px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendSeries} margin={{ left: -14, right: 8, top: 14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashTrendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#62e6ff" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#62e6ff" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" strokeDasharray="4 6" />
                  <XAxis dataKey="day" interval={4} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(12,15,20,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff" }} />
                  <Area type="monotone" dataKey="tecnologia" stroke="#62e6ff" strokeWidth={3} fill="url(#dashTrendFill)" />
                  <Area type="monotone" dataKey="beleza" stroke="#65f0b7" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="casa" stroke="#f8b85c" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="games" stroke="#8b5cf6" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="kombai-card p-5">
            <h2 className="text-lg font-black text-white">Comparação Marketplaces</h2>
            <p className="mt-1 text-sm text-slate-500">Performance por plataforma</p>
            <div className="mt-8 h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Radar name="Shopee" dataKey="shopee" stroke="#65f0b7" fill="#65f0b7" fillOpacity={0.14} strokeWidth={3} />
                  <Radar name="Amazon" dataKey="amazon" stroke="#62e6ff" fill="#62e6ff" fillOpacity={0.1} strokeWidth={3} />
                  <Radar name="Mercado Livre" dataKey="ml" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-mint" />Shopee</span>
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-electric" />Amazon</span>
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-violet" />Mercado Livre</span>
            </div>
          </section>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <section className="kombai-card p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white">Top Oportunidades</h2>
                <p className="mt-1 text-sm text-slate-500">{isLoading ? "Carregando produtos..." : "Produtos com maior score agora"}</p>
              </div>
              <button className="text-sm font-black text-cyan-200">Ver todos →</button>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <OpportunityRow key={`${product.name}-${index}`} product={product} rank={index + 1} />
              ))}
            </div>
          </section>

          <section className="kombai-card p-5">
            <h2 className="text-lg font-black text-white">Risco × Margem</h2>
            <p className="mt-1 text-sm text-slate-500">Produtos no quadrante ideal: alta margem, baixo risco</p>
            <div className="mt-5 h-[310px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: -16, right: 18, top: 18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" />
                  <XAxis type="number" dataKey="margin" name="Margem" unit="%" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="risk" name="Risco" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "rgba(12,15,20,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff" }} />
                  <Scatter data={scatterData} fill="#62e6ff" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr_0.9fr]">
          <section className="kombai-card p-5">
            <h2 className="text-lg font-black text-white">Nichos em Alta</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Tecnologia", 92],
                ["Beleza", 87],
                ["Games", 83],
                ["Pets", 79],
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
              <h2 className="text-lg font-black text-white">Alertas</h2>
              <span className="kombai-chip kombai-chip-orange">2 novos</span>
            </div>
            <div className="mt-5 space-y-3">
              <AlertRow title="Alta concorrência em Fones Bluetooth" detail="Novas lojas entrando no nicho · 2h atras" />
              <AlertRow title="Margem caindo em Capas de Celular" detail="-3.2% na ultima semana · 1d atras" />
              <AlertRow title="Boa oportunidade em Impressoras Portáteis" detail="Demanda crescendo 28% · Agora" positive />
            </div>
          </section>

          <section className="kombai-card kombai-card-green p-5">
            <h2 className="text-lg font-black text-white">IA Score Global</h2>
            <p className="mt-1 text-sm text-slate-500">Analise de hoje · Sao Paulo</p>
            <div className="mt-8 flex items-end gap-2">
              <span className="font-mono text-6xl font-black text-white">78</span>
              <span className="pb-2 text-lg font-black text-slate-500">/100</span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Mercado aquecido, concorrência moderada, boas margens em tech e beleza.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="kombai-chip kombai-chip-green">Favorável</span>
              <span className="kombai-chip kombai-chip-cyan">Tech ↑</span>
              <span className="kombai-chip">Risco Médio</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({ icon, value, label, detail, badge }: { icon: ReactNode; value: string; label: string; detail: string; badge: string }) {
  return (
    <article className="kombai-card kombai-card-soft p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          {icon}
        </span>
        <span className="kombai-chip kombai-chip-green">{badge}</span>
      </div>
      <p className="mt-6 font-mono text-4xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </article>
  );
}

function ScoreOrb() {
  return (
    <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-[5px] border-cyan-300 text-xs font-black text-white shadow-[0_0_24px_rgba(98,230,255,0.5)]">
      84
    </span>
  );
}

function OpportunityRow({ product, rank }: { product: Product | (typeof fallbackProducts)[number]; rank: number }) {
  const margin = product.average_price ? ((product.average_price - product.estimated_cost) / product.average_price) * 100 : 0;
  const score = Math.round(product.trend_score);

  return (
    <div className={rank === 1 ? "data-row-highlight p-4" : "data-row p-4"}>
      <div className="grid items-center gap-4 md:grid-cols-[42px_1fr_72px_72px]">
        <span className="font-mono text-sm font-black text-slate-600">#{rank}</span>
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
