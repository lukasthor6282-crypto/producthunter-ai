import { PackageCheck, Truck, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import type { RecommendedProduct } from '../../types/product'
import { ConversionChart } from '../charts/ConversionChart'
import { MarginChart } from '../charts/MarginChart'
import { GlassPanel } from '../ui/GlassPanel'
import { MarketplaceBadge } from '../ui/MarketplaceBadge'
import { OpportunityScoreRing } from '../ui/OpportunityScoreRing'
import { RiskIndicator } from '../ui/RiskIndicator'

interface ProductDetailPanelProps {
  product: RecommendedProduct
}

export function ProductDetailPanel({ product }: ProductDetailPanelProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <GlassPanel className="xl:col-span-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <MarketplaceBadge marketplace={product.marketplace} />
            <h2 className="mt-3 text-2xl font-bold text-white">{product.product_name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-mist">{product.recommendation_reason}</p>
          </div>
          <OpportunityScoreRing score={product.opportunity_score} size={88} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Info icon={<Users size={18} />} label="Concorrencia" value={`${product.competitor_count} sellers`} />
          <Info icon={<Truck size={18} />} label="Entrega" value={`${product.delivery_time_days} dias`} />
          <Info icon={<PackageCheck size={18} />} label="Fornecedor" value={`${Math.round(product.supplier_reliability * 100)}%`} />
        </div>
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-white">Explicacao da IA</h3>
          <p className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm leading-6 text-mist">
            {product.recommended_strategy} Publico-alvo provavel: {product.target_audience}. O score pondera lucro,
            margem, demanda, tendencia, baixa concorrencia, avaliacoes, risco e conversao.
          </p>
        </div>
      </GlassPanel>
      <GlassPanel className="xl:col-span-5">
        <h3 className="text-sm font-semibold text-white">Indicadores comerciais</h3>
        <div className="mt-4 space-y-4">
          <RiskIndicator risk={product.risk_score} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Preco medio" value={`R$ ${product.average_price.toFixed(2)}`} />
            <Info label="Custo estimado" value={`R$ ${product.estimated_cost.toFixed(2)}`} />
            <Info label="Frete" value={`R$ ${product.shipping_cost.toFixed(2)}`} />
            <Info label="Comissao" value={`${Math.round(product.affiliate_commission_percent * 100)}%`} />
          </div>
        </div>
      </GlassPanel>
      <GlassPanel className="xl:col-span-7">
        <h3 className="text-sm font-semibold text-white">Margem entre recomendados</h3>
        <MarginChart products={[product]} />
      </GlassPanel>
      <GlassPanel className="xl:col-span-5">
        <h3 className="text-sm font-semibold text-white">Funil estimado</h3>
        <ConversionChart />
      </GlassPanel>
    </div>
  )
}

function Info({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-3">
      <div className="flex items-center gap-2 text-mint">
        {icon}
        <span className="text-xs text-mist">{label}</span>
      </div>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  )
}
