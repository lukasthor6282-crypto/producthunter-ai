import type { RecommendedProduct } from '../../types/product'
import { GlassPanel } from '../ui/GlassPanel'
import { MarketplaceBadge } from '../ui/MarketplaceBadge'
import { RiskIndicator } from '../ui/RiskIndicator'

interface ComparisonTableProps {
  products: RecommendedProduct[]
}

export function ComparisonTable({ products }: ComparisonTableProps) {
  return (
    <GlassPanel>
      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <article key={product.product_id} className="rounded-lg border border-line bg-white/[0.035] p-3">
            <div className="flex flex-col gap-2">
              <MarketplaceBadge marketplace={product.marketplace} />
              <h3 className="break-words text-sm font-bold leading-tight text-white">{product.product_name}</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <MobileMetric label="Margem" value={`${Math.round(product.estimated_margin * 100)}%`} highlight />
              <MobileMetric label="Lucro" value={`R$ ${product.estimated_profit.toFixed(2)}`} />
              <MobileMetric label="Conversao" value={`${Math.round(product.conversion_probability * 100)}%`} />
              <MobileMetric label="Concorrencia" value={product.competition_level} />
            </div>
            <div className="mt-3 rounded-lg border border-line bg-white/[0.035] p-3">
              <RiskIndicator risk={product.risk_score} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
          <thead className="text-xs uppercase text-mist">
            <tr>
              <th className="px-3 py-2">Produto</th>
              <th className="px-3 py-2">Marketplace</th>
              <th className="px-3 py-2">Margem</th>
              <th className="px-3 py-2">Lucro</th>
              <th className="px-3 py-2">Conversao</th>
              <th className="px-3 py-2">Concorrencia</th>
              <th className="px-3 py-2">Risco</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id} className="rounded-lg bg-white/[0.035]">
                <td className="rounded-l-lg px-3 py-3 font-semibold text-white">{product.product_name}</td>
                <td className="px-3 py-3"><MarketplaceBadge marketplace={product.marketplace} /></td>
                <td className="px-3 py-3 text-mint">{Math.round(product.estimated_margin * 100)}%</td>
                <td className="px-3 py-3">R$ {product.estimated_profit.toFixed(2)}</td>
                <td className="px-3 py-3">{Math.round(product.conversion_probability * 100)}%</td>
                <td className="px-3 py-3">{product.competition_level}</td>
                <td className="rounded-r-lg px-3 py-3"><RiskIndicator risk={product.risk_score} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}

function MobileMetric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-2">
      <p className="text-xs text-mist">{label}</p>
      <p className={`mt-1 font-semibold ${highlight ? 'text-mint' : 'text-white'}`}>{value}</p>
    </div>
  )
}
