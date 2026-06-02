import { ArrowUpRight, Heart, Target } from 'lucide-react'
import type { RecommendedProduct } from '../../types/product'
import { MarketplaceBadge } from '../ui/MarketplaceBadge'
import { OpportunityScoreRing } from '../ui/OpportunityScoreRing'
import { RiskIndicator } from '../ui/RiskIndicator'
import { TiltCard3D } from '../ui/TiltCard3D'

interface ProductOpportunityCardProps {
  product: RecommendedProduct
  onInspect: (product: RecommendedProduct) => void
}

export function ProductOpportunityCard({ product, onInspect }: ProductOpportunityCardProps) {
  return (
    <TiltCard3D className="glass-surface p-4">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <MarketplaceBadge marketplace={product.marketplace} />
            <h3 className="mt-3 break-words text-lg font-bold leading-tight text-white">{product.product_name}</h3>
            <p className="mt-1 text-sm text-mist">{product.category}</p>
          </div>
          <OpportunityScoreRing score={product.opportunity_score} />
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm min-[360px]:grid-cols-3">
          <Metric label="Margem" value={`${Math.round(product.estimated_margin * 100)}%`} />
          <Metric label="Lucro" value={`R$ ${product.estimated_profit.toFixed(2)}`} />
          <Metric label="Conversao" value={`${Math.round(product.conversion_probability * 100)}%`} />
        </div>
        <RiskIndicator risk={product.risk_score} />
        <p className="text-sm leading-6 text-mist">{product.recommendation_reason}</p>
        <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-md bg-white/10 px-2.5 py-1.5 text-xs text-mint">
            <Target size={14} /> Melhor para {product.best_for}
          </span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-line p-2 text-mist hover:text-white" type="button" title="Favoritar">
              <Heart size={16} />
            </button>
            <button
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-ink min-[420px]:flex-none"
              onClick={() => onInspect(product)}
              type="button"
            >
              Detalhar <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </TiltCard3D>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-2">
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}
