import { ArrowUpRight } from "lucide-react";

import { brl, compactNumber, percent } from "../../services/format";
import type { RecommendationItem } from "../../types/recommendation";
import { OpportunityScoreRing } from "../dashboard/OpportunityScoreRing";
import { MarketplaceBadge } from "../product/MarketplaceBadge";
import { RiskIndicator } from "../product/RiskIndicator";
import { GlassCard } from "../ui/GlassCard";

type ProductRankingTableProps = {
  items: RecommendationItem[];
  selectedId?: number;
  onSelect: (item: RecommendationItem) => void;
};

export function ProductRankingTable({ items, selectedId, onSelect }: ProductRankingTableProps) {
  return (
    <GlassCard className="overflow-hidden p-0" variant="strong" interactive>
      <div className="border-b border-white/10 px-5 py-4">
        <p className="section-label">ranking decisivo</p>
        <h2 className="mt-1 text-xl font-extrabold text-white">Produtos recomendados</h2>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.map((item, index) => {
          const isSelected = selectedId === item.product.id;
          return (
            <article
              key={item.product.id}
              className={`rounded-lg border p-3 ${
                isSelected ? "border-mint/30 bg-mint/[0.08]" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="mono-number flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-sm font-extrabold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <MarketplaceBadge marketplace={item.product.marketplace} label={item.product.marketplace_label} />
                  </div>
                  <h3 className="break-words text-sm font-extrabold leading-tight text-white">{item.product.name}</h3>
                  <p className="mt-1 text-xs font-bold text-mist">{item.product.niche_label}</p>
                </div>
                <OpportunityScoreRing score={item.opportunity_score} size="xs" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <MobileMetric label="Margem" value={percent(item.estimated_margin_percent)} tone="mint" />
                <MobileMetric label="Lucro" value={brl.format(item.estimated_profit)} />
                <MobileMetric label="Conversao" value={percent(item.conversion_probability)} tone="electric" />
                <MobileMetric label="Busca" value={compactNumber(item.product.search_volume)} />
              </div>

              <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <RiskIndicator value={item.risk_score} compact />
              </div>

              <button
                type="button"
                onClick={() => onSelect(item)}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.08] text-sm font-bold text-white transition hover:border-electric/35 hover:bg-electric/10 hover:text-electric"
              >
                Ver produto
                <ArrowUpRight size={16} />
              </button>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-[0.14em] text-mist">
              <th className="px-5 py-3 font-bold">Produto</th>
              <th className="px-4 py-3 font-bold">Score</th>
              <th className="px-4 py-3 font-bold">Margem</th>
              <th className="px-4 py-3 font-bold">Lucro</th>
              <th className="px-4 py-3 font-bold">Conversao</th>
              <th className="px-4 py-3 font-bold">Busca</th>
              <th className="px-4 py-3 font-bold">Risco</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const isSelected = selectedId === item.product.id;
              return (
                <tr
                  key={item.product.id}
                  className={`border-b border-white/[0.07] text-sm transition last:border-b-0 ${
                    isSelected ? "bg-mint/[0.08]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <td className="max-w-[310px] px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="mono-number flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] font-extrabold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <MarketplaceBadge marketplace={item.product.marketplace} label={item.product.marketplace_label} />
                          <span className="rounded-md border border-white/10 bg-white/[0.055] px-2 py-1 text-xs font-bold text-mist">
                            {item.product.niche_label}
                          </span>
                        </div>
                        <p className="truncate font-extrabold text-white">{item.product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <OpportunityScoreRing score={item.opportunity_score} size="xs" />
                  </td>
                  <td className="mono-number px-4 py-4 font-bold text-mint">{percent(item.estimated_margin_percent)}</td>
                  <td className="mono-number px-4 py-4 font-bold text-white">{brl.format(item.estimated_profit)}</td>
                  <td className="mono-number px-4 py-4 font-bold text-electric">{percent(item.conversion_probability)}</td>
                  <td className="mono-number px-4 py-4 font-bold text-white">{compactNumber(item.product.search_volume)}</td>
                  <td className="w-44 px-4 py-4">
                    <RiskIndicator value={item.risk_score} compact />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      aria-label={`Selecionar ${item.product.name}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-white transition hover:border-electric/35 hover:bg-electric/10 hover:text-electric"
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </td>
                </tr>
              );
            })}
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
      <p className={`mono-number mt-1 font-extrabold ${valueClass}`}>{value}</p>
    </div>
  );
}
