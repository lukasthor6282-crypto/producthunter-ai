import { brl, percent } from "../../services/format";
import type { RecommendationItem } from "../../types/recommendation";
import { GlassCard } from "../ui/GlassCard";
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
      <div className="overflow-x-auto">
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
                <td className="px-5 py-4 font-bold text-white">{item.product.name}</td>
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
