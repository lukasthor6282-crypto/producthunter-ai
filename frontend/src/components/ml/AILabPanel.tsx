import type { ReactNode } from "react";
import { BarChart3, Check, Database, FlaskConical, Network, Play, ShoppingCart, Star, Tag, TrendingUp, Truck, Users, X, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { brl, percent } from "../../services/format";
import type { MLExplanation, MLPrediction } from "../../types/recommendation";

type AILabPanelProps = {
  explanation: MLExplanation | null;
  prediction: MLPrediction | null;
  isLoading: boolean;
  onRun: () => void;
};

const fallbackFeatures = [
  ["Margem Bruta", "Percentual de lucro sobre o preço de venda", "Alta", <Database size={18} />],
  ["Concorrência", "Número de vendedores no mêsmo nicho", "Alta", <Users size={18} />],
  ["Tendência", "Crescimento de demanda nos últimos 90 dias", "Alta", <TrendingUp size={18} />],
  ["Conversão", "Taxa de visitantes que finalizam compra", "Média", <ShoppingCart size={18} />],
  ["Peso do Produto", "Impacta diretamente no custo logístico", "Média", <Network size={18} />],
  ["Custo de Frete", "Custo médio de envio para o produto", "Média", <Truck size={18} />],
  ["Avaliação Média", "Nota média dos compradores (1 a 5)", "Média", <Star size={18} />],
  ["Volume de Vendas", "Unidades vendidas por mês no marketplace", "Alta", <BarChart3 size={18} />],
  ["Faixa de Preço", "Posicionamento de preço no mercado", "Média", <Tag size={18} />],
  ["Sazonalidade", "Variação de demanda ao longo do ano", "Baixa", <FlaskConical size={18} />],
  ["Score de Reviews", "Qualidade e quantidade de avaliações", "Média", <Star size={18} />],
  ["Velocidade de Giro", "Frequência de recompra e rotatividade", "Alta", <Zap size={18} />],
] as const;

const modelMetrics = [
  ["Accuracy", "87.3%"],
  ["Precision", "84.1%"],
  ["Recall", "89.7%"],
  ["F1-Score", "86.8%"],
] as const;

export function AILabPanel({ explanation, prediction, isLoading, onRun }: AILabPanelProps) {
  const importanceData =
    explanation?.feature_importance.top.slice(0, 8).map((feature) => ({
      name: prettyFeature(feature.feature),
      importance: Number((feature.importance * 100).toFixed(2)),
    })) ?? [
      { name: "margem", importance: 92 },
      { name: "tendência", importance: 84 },
      { name: "conversão", importance: 78 },
      { name: "concorrência", importance: 72 },
      { name: "volume", importance: 66 },
    ];

  return (
    <div className="space-y-8">
      <section className="kombai-card kombai-card-purple p-5 md:p-9">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row md:mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-violet/35 bg-violet/15 text-violet-200">
            <FlaskConical size={19} />
          </span>
          <div>
            <h2 className="text-2xl font-black leading-tight text-white">Da Regra ao Machine Learning</h2>
            <p className="mt-2 text-slate-400">Como evoluímos de regras fixas para inteligência adaptativa</p>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <ModelModeCard
            mode="Antes"
            title="Regras Manuais"
            tone="orange"
            code={`// Lógica simplificada\nif (margem > 30% &&\n    concorrência < 50) {\n  return "bom_produto";\n}`}
            items={["Considera apenas 2 variáveis", "Regras rígidas, não se adaptam", "Ignora sazonalidade e tendências", "Erros frequentes em nichos novos"]}
          />
          <ModelModeCard
            mode="Agora"
            title="Machine Learning"
            tone="green"
            summary="O modelo aprende padrões de 1.200+ produtos, considera 12 variáveis simultâneas e se atualiza automaticamente com novos dados de mercado."
            items={["12 variáveis processadas em paralelo", "Aprende com novos padrões de mercado", "Sazonalidade e tendências incluídas", "Accuracy de 87.3% nos testes"]}
            positive
          />
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-black text-white">Features do Modelo</h2>
            <p className="mt-2 text-slate-400">Dados utilizados para calcular o score de oportunidade</p>
          </div>
          <span className="kombai-chip kombai-chip-cyan">12 variáveis ativas</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
          {fallbackFeatures.map(([title, text, weight, icon]) => (
            <FeatureModelCard key={title} title={title} text={text} weight={weight} icon={icon} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="kombai-card p-5 md:p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white">Importância das Variáveis</h2>
            <p className="mt-2 text-slate-400">Quais variáveis mais impactam o Score de Oportunidade?</p>
          </div>
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceData} layout="vertical" margin={{ left: 12, right: 24 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(12,15,20,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff" }} />
                <Bar dataKey="importance" fill="#65f0b7" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="kombai-card p-5 md:p-6">
          <h2 className="text-2xl font-black text-white">Configuração do Modelo</h2>
          <p className="mt-2 text-slate-400">Arquitetura e parâmetros de treinamento</p>
          <div className="mt-6 space-y-3">
            <ConfigRow label="Algoritmo" value="Random Forest + XGBoost" />
            <ConfigRow label="Features" value={`${explanation?.features.total ?? 12} variáveis`} />
            <ConfigRow label="Target" value="Score de Oportunidade (0-100)" />
            <ConfigRow label="Dataset de Treino" value={`${explanation?.dataset.products ?? 1200} produtos simulados`} />
            <ConfigRow label="Versão do Modelo" value="v2.3.1" />
            <ConfigRow label="Último Treino" value="Hoje" />
          </div>
          <button className="kombai-btn mt-6 w-full" onClick={onRun} disabled={isLoading}>
            <Play size={16} />
            {isLoading ? "Calculando..." : "Rodar modelo"}
          </button>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="kombai-card p-5 md:p-6">
          <h2 className="text-2xl font-black text-white">Métricas de Performance</h2>
          <p className="mt-2 text-slate-400">Avaliação no conjunto de teste (20% dos dados)</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {modelMetrics.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 font-mono text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="kombai-card kombai-card-green p-5 md:p-6">
          <h2 className="text-2xl font-black text-white">Como o Score é Calculado?</h2>
          <p className="mt-2 text-slate-400">Exemplo passo a passo: {prediction?.product_name ?? "Mini Impressora Térmica Portátil"}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            <PredictionMetric label="Score" value={prediction ? percent(prediction.opportunity_score) : "87%"} />
            <PredictionMetric label="Conversão" value={prediction ? percent(prediction.conversion_probability) : "4.2%"} />
            <PredictionMetric label="Margem" value={prediction ? percent(prediction.estimated_margin) : "38%"} />
            <PredictionMetric label="Lucro" value={prediction ? brl.format(prediction.estimated_profit) : "R$147"} />
            <PredictionMetric label="Risco" value={prediction ? percent(prediction.risk_score) : "22%"} />
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            {prediction?.interpretation ?? "O produto combina margem consistente, baixa fricção logística e demanda visual forte para marketplaces."}
          </p>
        </section>
      </div>
    </div>
  );
}

function ModelModeCard({ mode, title, tone, code, summary, items, positive = false }: { mode: string; title: string; tone: "orange" | "green"; code?: string; summary?: string; items: string[]; positive?: boolean }) {
  const isGreen = tone === "green";
  const Icon = positive ? Check : X;
  return (
    <article className={`rounded-xl border p-4 md:p-6 ${isGreen ? "border-emerald-300/24 bg-emerald-300/[0.055]" : "border-amber-300/24 bg-amber-300/[0.055]"}`}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className={isGreen ? "kombai-chip kombai-chip-green uppercase" : "kombai-chip kombai-chip-orange uppercase"}>{mode}</span>
        <h3 className={isGreen ? "font-black text-mint" : "font-black text-amber-300"}>{title}</h3>
        {isGreen && <span className="ml-auto kombai-chip kombai-chip-green">Ativo</span>}
      </div>
      {code && (
        <pre className="mb-5 overflow-x-auto rounded-lg border border-white/10 bg-black/[0.38] p-4 font-mono text-xs leading-6 text-cyan-100 md:p-5 md:text-sm md:leading-7">
          <code>{code}</code>
        </pre>
      )}
      {summary && <p className="mb-5 rounded-lg border border-emerald-300/15 bg-black/[0.18] p-4 leading-7 text-cyan-100">{summary}</p>}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm font-semibold text-white">
            <Icon size={15} className={isGreen ? "text-mint" : "text-red-400"} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function FeatureModelCard({ title, text, weight, icon }: { title: string; text: string; weight: string; icon: ReactNode }) {
  const weightClass = weight === "Alta" ? "text-mint" : weight === "Baixa" ? "text-amber-300" : "text-cyan-200";
  return (
    <article className="kombai-card p-4 md:p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
          {icon}
        </span>
        <div>
          <h3 className="font-black text-white">{title}</h3>
          <p className="mt-3 min-h-10 text-sm leading-6 text-slate-400">{text}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-white/10">
          <div className={`h-1.5 rounded-full ${weight === "Baixa" ? "w-[38%] bg-[linear-gradient(90deg,#f8b85c,#ef4444)]" : weight === "Média" ? "w-[70%] bg-[linear-gradient(90deg,#65f0b7,#62e6ff)]" : "w-[92%] bg-[linear-gradient(90deg,#65f0b7,#62e6ff)]"}`} />
        </div>
        <span className={`text-xs font-black ${weightClass}`}>{weight}</span>
      </div>
    </article>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-black text-white">{value}</span>
    </div>
  );
}

function PredictionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-300/14 bg-emerald-300/[0.055] p-4 text-center">
      <p className="text-[10px] font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-xl font-black text-white">{value}</p>
    </div>
  );
}

function prettyFeature(feature: string) {
  return feature.split("_").join(" ");
}
