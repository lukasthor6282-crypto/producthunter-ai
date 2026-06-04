import { brl, percent } from "../../services/format";
import type { RecommendationItem } from "../../types/recommendation";
import { OpportunityScoreRing } from "../dashboard/OpportunityScoreRing";
import { GlassCard } from "../ui/GlassCard";
import { MarketplaceBadge } from "./MarketplaceBadge";
import { ProductImage } from "./ProductImage";
import { RiskIndicator } from "./RiskIndicator";

type ComparisonTableProps = {
  items: RecommendationItem[];
};

export function ComparisonTable({ items }: ComparisonTableProps) {
  const rows = items.slice(0, 4);

  return (
    <GlassCard className="p-0" variant="strong" interactive>
      <div className="border-b border-white/10 px-5 py-4">
        <p className="section-label">comparativo</p>
        <h3 className="mt-1 text-xl font-extrabold text-white">Top produtos lado a lado</h3>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {rows.map((item) => (
          <article key={item.product.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <ProductImage product={item.product} className="h-14 w-14" />
                <div className="min-w-0">
                  <MarketplaceBadge marketplace={item.product.marketplace} label={item.product.marketplace_label} />
                  <h3 className="mt-2 break-words text-sm font-extrabold leading-tight text-white">{item.product.name}</h3>
                </div>
              </div>
              <OpportunityScoreRing score={item.opportunity_score} size="xs" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <MobileMetric label="Margem" value={percent(item.estimated_margin_percent)} tone="mint" />
              <MobileMetric label="Lucro" value={brl.format(item.estimated_profit)} />
              <MobileMetric label="Conversao" value={percent(item.conversion_probability)} tone="electric" />
              <MobileMetric label="Nicho" value={item.product.niche_label} />
            </div>

            <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <RiskIndicator value={item.risk_score} compact />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-[0.14em] text-mist">
              <th className="px-5 py-3">Produto</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Margem</th>
              <th className="px-4 py-3">Lucro</th>
              <th className="px-4 py-3">Conversao</th>
              <th className="px-4 py-3">Risco</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.product.id} className="border-b border-white/[0.07] last:border-b-0">
                <td className="px-5 py-4 font-bold text-white">
                  <div className="flex min-w-0 items-center gap-3">
                    <ProductImage product={item.product} className="h-11 w-11" />
                    <span className="truncate">{item.product.name}</span>
                  </div>
                </td>
                <td className="mono-number px-4 py-4 font-bold text-mint">{item.opportunity_score.toFixed(0)}/100</td>
                <td className="mono-number px-4 py-4 font-bold text-white">{percent(item.estimated_margin_percent)}</td>
                <td className="mono-number px-4 py-4 font-bold text-white">{brl.format(item.estimated_profit)}</td>
                <td className="mono-number px-4 py-4 font-bold text-electric">{percent(item.conversion_probability)}</td>
                <td className="w-44 px-4 py-4">
                  <RiskIndicator value={item.risk_score} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function MobileMetric({ label, value, tone }: { label: string; value: string; tone?: "mint" | "electric" }) {
  const valueClass = tone === "mint" ? "text-mint" : tone === "electric" ? "text-electric" : "text-white";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-mist">{label}</p>
      <p className={`mt-1 break-words font-extrabold ${valueClass}`}>{value}</p>
    </div>
  );
}
