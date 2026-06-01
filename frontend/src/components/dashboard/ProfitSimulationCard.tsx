import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Calculator, Package, Percent, ReceiptText, Target } from "lucide-react";

import { simulateProfit } from "../../services/recommendationApi";
import { brl, percent } from "../../services/format";
import type { RecommendationItem } from "../../types/recommendation";

type ProfitSimulationCardProps = {
  item?: RecommendationItem;
};

export function ProfitSimulationCard({ item }: ProfitSimulationCardProps) {
  const product = item?.product;
  const [salePrice, setSalePrice] = useState(product?.average_price ?? 89);
  const [productCost, setProductCost] = useState(product?.estimated_cost ?? 45);
  const [platformFee, setPlatformFee] = useState(product ? product.platform_fee_percent * 100 : 14);
  const [shipping, setShipping] = useState(product?.estimated_shipping ?? 12);
  const [packaging, setPackaging] = useState(product?.packaging_cost ?? 2.5);
  const [tax, setTax] = useState(product ? product.estimated_tax_percent * 100 : 6);
  const [commission, setCommission] = useState(product ? product.affiliate_commission_percent * 100 : 0);
  const [units, setUnits] = useState(50);

  useEffect(() => {
    if (!product) return;
    setSalePrice(product.average_price);
    setProductCost(product.estimated_cost);
    setPlatformFee(product.platform_fee_percent * 100);
    setShipping(product.estimated_shipping);
    setPackaging(product.packaging_cost);
    setTax(product.estimated_tax_percent * 100);
    setCommission(product.affiliate_commission_percent * 100);
  }, [product]);

  const simulationQuery = useQuery({
    queryKey: ["profit", product?.id, units],
    queryFn: () =>
      simulateProfit({
        product_id: product?.id ?? 0,
        monthly_units: units,
        ad_cost_per_unit: 0,
        fixed_monthly_cost: 0,
      }),
    enabled: Boolean(product?.id),
  });

  const totals = useMemo(() => {
    const revenue = salePrice * units;
    const productTotal = productCost * units;
    const platformTotal = revenue * (platformFee / 100);
    const shippingTotal = (shipping + packaging) * units;
    const taxTotal = revenue * (tax / 100);
    const commissionTotal = revenue * (commission / 100);
    const netProfit = revenue - productTotal - platformTotal - shippingTotal - taxTotal - commissionTotal;
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const contribution = salePrice - productCost - salePrice * (platformFee / 100) - shipping - packaging - salePrice * (tax / 100) - salePrice * (commission / 100);
    const breakeven = contribution > 0 ? Math.max(1, Math.ceil(450 / contribution)) : 0;

    return { revenue, productTotal, platformTotal, shippingTotal, taxTotal, commissionTotal, netProfit, margin, breakeven };
  }, [commission, packaging, platformFee, productCost, salePrice, shipping, tax, units]);

  const scaleData = useMemo(() => {
    return [10, 25, 50, 100, 150].map((scale) => {
      const revenue = salePrice * scale;
      const totalCost =
        productCost * scale +
        revenue * (platformFee / 100) +
        (shipping + packaging) * scale +
        revenue * (tax / 100) +
        revenue * (commission / 100);
      return {
        scale: `${scale}`,
        Receita: Math.max(0, revenue),
        "Custo Total": Math.max(0, totalCost),
        Lucro: Math.max(0, revenue - totalCost),
      };
    });
  }, [commission, packaging, platformFee, productCost, salePrice, shipping, tax]);

  const backendProfit = simulationQuery.data?.net_monthly_profit ?? simulationQuery.data?.monthly_profit;

  return (
    <div className="grid gap-5 md:gap-7 xl:grid-cols-[0.94fr_1fr]">
      <section className="kombai-card p-4 md:p-7">
        {!product && (
          <div className="mb-6 rounded-lg border border-cyan-300/18 bg-cyan-300/[0.055] p-4 text-sm leading-6 text-slate-400">
            Selecione um produto no ranking para carregar dados reais da API. Os valores abaixo seguem o exemplo visual do canvas.
          </div>
        )}

        <div className="space-y-7 md:space-y-8">
          <ControlGroup icon={<Package size={15} />} title="Preco e custo">
            <MoneyInput label="Preço de Venda" value={salePrice} onChange={setSalePrice} />
            <MoneyInput label="Custo do Produto" value={productCost} onChange={setProductCost} />
          </ControlGroup>

          <ControlGroup icon={<Percent size={15} />} title="Taxas da plataforma">
            <RangeControl label={`Taxa ${product?.marketplace_label ?? "Shopee"}`} value={platformFee} suffix="%" min={0} max={20} onChange={setPlatformFee} />
            <div className="grid gap-3 md:grid-cols-2">
              <MoneyInput label="Frete estimado" value={shipping} onChange={setShipping} />
              <MoneyInput label="Embalagem" value={packaging} onChange={setPackaging} step={0.5} />
            </div>
          </ControlGroup>

          <ControlGroup icon={<ReceiptText size={15} />} title="Impostos e comissoes">
            <RangeControl label="Imposto (Simples)" value={tax} suffix="%" min={0} max={15} onChange={setTax} />
            <PercentInput label="Comissão de Afiliado" value={commission} onChange={setCommission} />
          </ControlGroup>

          <ControlGroup icon={<Target size={15} />} title="Volume de vendas">
            <RangeControl label="Vendas/mês esperadas" value={units} suffix="und." min={10} max={500} onChange={setUnits} />
          </ControlGroup>

          <button className="kombai-btn kombai-btn-solid min-h-14 w-full text-base" type="button">
            <Calculator size={17} />
            Calcular Lucro
          </button>
        </div>
      </section>

      <div className="space-y-5">
        <section className="kombai-card kombai-card-green p-5 md:p-7">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Lucro mensal estimado</p>
          <p className="mt-4 font-mono text-4xl font-black leading-none text-mint md:text-7xl">{brl.format(totals.netProfit)}</p>
          <p className="mt-3 text-slate-400">com {units} unidades vendidas/mes</p>

          <div className="mt-8 space-y-1">
            <BreakdownRow label="Receita Total" value={brl.format(totals.revenue)} />
            <BreakdownRow label="(-) Custo dos Produtos" value={`- ${brl.format(totals.productTotal)}`} negative />
            <BreakdownRow label="(-) Taxas da Plataforma" value={`- ${brl.format(totals.platformTotal)}`} negative />
            <BreakdownRow label="(-) Frete + Embalagem" value={`- ${brl.format(totals.shippingTotal)}`} negative />
            <BreakdownRow label="(-) Impostos" value={`- ${brl.format(totals.taxTotal)}`} negative />
            {commission > 0 && <BreakdownRow label="(-) Comissoes" value={`- ${brl.format(totals.commissionTotal)}`} negative />}
            <BreakdownRow label="(=) Lucro Liquido" value={brl.format(totals.netProfit)} strong />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Margem Liquida</span>
              <span className="font-mono font-black text-mint">{percent(totals.margin, 1)}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-[linear-gradient(90deg,#62e6ff,#65f0b7)]" style={{ width: `${Math.max(0, Math.min(100, totals.margin))}%` }} />
            </div>
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-400">
            <span className="text-cyan-200">◎</span> Ponto de Equilibrio:{" "}
            <strong className="text-white">{totals.breakeven} unidades/mes</strong>
          </p>
          {backendProfit !== undefined && (
            <p className="mt-2 text-xs font-semibold text-slate-600">API validada: {brl.format(backendProfit)}</p>
          )}
        </section>

        <section className="kombai-card p-5 md:p-6">
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-200">Comparativo por escala</h2>
          <div className="mt-6 h-[300px] md:h-[410px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scaleData} margin={{ left: 4, right: 16, top: 12, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="scale" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${Math.round(Number(value) / 1000)}k`} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.035)" }} contentStyle={{ background: "rgba(12,15,20,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff" }} />
                <Bar dataKey="Receita" fill="#62e6ff" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Custo Total" fill="#f8b85c" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Lucro" fill="#65f0b7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

function ControlGroup({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400 md:mb-5 md:text-sm">
        {icon}
        {title}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function MoneyInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-400">{label}</span>
      <div className="kombai-input flex min-h-12 items-center gap-3 px-4">
        <span className="text-slate-400">R$</span>
        <input
          type="number"
          min={0}
          step={step}
          value={Number(value.toFixed(2))}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 bg-transparent font-mono font-black text-white outline-none"
        />
      </div>
    </label>
  );
}

function PercentInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-400">{label}</span>
      <div className="kombai-input flex min-h-12 items-center gap-3 px-4">
        <input
          type="number"
          min={0}
          max={100}
          value={Number(value.toFixed(1))}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 bg-transparent font-mono font-black text-white outline-none"
        />
        <span className="text-slate-400">%</span>
      </div>
    </label>
  );
}

function RangeControl({ label, value, suffix, min, max, onChange }: { label: string; value: number; suffix: string; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-400">
        {label}
        <strong className="font-mono text-cyan-200">{value.toLocaleString("pt-BR")} {suffix}</strong>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="kombai-range w-full" />
      <span className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </label>
  );
}

function BreakdownRow({ label, value, negative = false, strong = false }: { label: string; value: string; negative?: boolean; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 border-b border-white/10 py-4 text-sm last:border-b-0 md:text-base ${strong ? "rounded-lg border-b-0 bg-white/[0.055] px-3" : ""}`}>
      <span className={strong ? "font-black text-white" : "text-slate-400"}>{label}</span>
      <span className={`font-mono font-black ${strong ? "text-mint" : negative ? "text-red-400" : "text-white"}`}>{value}</span>
    </div>
  );
}
