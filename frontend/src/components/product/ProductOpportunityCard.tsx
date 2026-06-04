import { ArrowUpRight, Gauge, Sparkles, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { OpportunityScoreRing } from "../dashboard/OpportunityScoreRing";
import { GlassCard } from "../ui/GlassCard";
import { TiltCard3D } from "../ui/TiltCard3D";
import { brl, compactNumber, percent } from "../../services/format";
import type { RecommendationItem } from "../../types/recommendation";
import { MarketplaceBadge } from "./MarketplaceBadge";
import { ProductImage } from "./ProductImage";
import { RiskIndicator } from "./RiskIndicator";

type ProductOpportunityCardProps = {
  item: RecommendationItem;
  rank: number;
  onSelect?: () => void;
  compact?: boolean;
};

export function ProductOpportunityCard({ item, rank, onSelect, compact = false }: ProductOpportunityCardProps) {
  return (
    <TiltCard3D>
      <GlassCard className="group overflow-hidden p-4 transition duration-300 hover:shadow-[0_28px_100px_rgba(0,0,0,0.55)]" variant={rank === 1 ? "mint" : "strong"} interactive>
        <div className="absolute right-0 top-0 h-1 w-full bg-[linear-gradient(90deg,transparent,rgba(98,230,255,0.45),rgba(101,240,183,0.35),transparent)] opacity-0 transition group-hover:opacity-100" />
        <div className={`flex min-w-0 flex-col gap-4 ${compact ? "" : "xl:flex-row xl:items-center"}`}>
          <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <ProductImage product={item.product} className="h-16 w-16 sm:h-20 sm:w-20" iconSize={24} />
              <span className="mono-number absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#0b111b] text-xs font-extrabold text-white shadow-[0_10px_28px_rgba(0,0,0,0.38)]">
                {rank === 1 && <Sparkles className="absolute -right-1 -top-1 text-mint" size={12} />}
                {String(rank).padStart(2, "0")}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <MarketplaceBadge marketplace={item.product.marketplace} label={item.product.marketplace_label} />
                <span className="rounded-md bg-white/[0.07] px-3 py-1 text-xs font-bold text-mist">
                  {item.product.niche_label}
                </span>
              </div>
              <h3 className="mt-3 break-words text-xl font-extrabold leading-tight text-white">{item.product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-mist">{item.explanation}</p>
            </div>
          </div>

          <div className={`grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 ${compact ? "" : "xl:w-[520px]"}`}>
            <Metric label="Margem" value={percent(item.estimated_margin_percent)} />
            <Metric label="Lucro" value={brl.format(item.estimated_profit)} />
            <Metric label="Conversao" value={percent(item.conversion_probability)} />
            <Metric label="Busca" value={compactNumber(item.product.search_volume)} />
          </div>

          <div className={`flex items-center justify-between gap-4 ${compact ? "" : "xl:w-48"}`}>
            <OpportunityScoreRing score={item.opportunity_score} size="sm" />
            <button
              type="button"
              onClick={onSelect}
              className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition hover:border-electric/40 hover:bg-electric/10 hover:text-electric"
              title="Ver produto"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 md:grid-cols-3">
          <Signal icon={<TrendingUp size={16} />} label="Concorrencia" value={percent(item.competition_score)} />
          <div className="rounded-md bg-white/[0.04] px-3 py-2">
            <RiskIndicator value={item.risk_score} compact />
          </div>
          <Signal icon={<Gauge size={16} />} label="Vendas" value={percent(item.product.sales_velocity)} />
        </div>
      </GlassCard>
    </TiltCard3D>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-panel p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-mist">{label}</p>
      <p className="mono-number mt-1 text-base font-extrabold text-white">{value}</p>
    </div>
  );
}

function Signal({ icon, label, value, valueClassName = "text-white" }: { icon: ReactNode; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="metric-panel flex items-center justify-between gap-2 px-3 py-2 text-sm">
      <span className="flex items-center gap-2 text-mist">
        <span className="text-electric">{icon}</span>
        {label}
      </span>
      <span className={`font-extrabold ${valueClassName}`}>{value}</span>
    </div>
  );
}
