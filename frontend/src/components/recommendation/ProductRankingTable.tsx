import type { RecommendedProduct } from '../../types/product'
import { MarketplaceBadge } from '../ui/MarketplaceBadge'

interface ProductRankingTableProps {
  products: RecommendedProduct[]
  onInspect: (product: RecommendedProduct) => void
}

export function ProductRankingTable({ products, onInspect }: ProductRankingTableProps) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {products.map((product, index) => (
          <article key={product.product_id} className="rounded-lg border border-line bg-white/[0.035] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-mint/15 text-sm font-bold text-mint">
                    {index + 1}
                  </span>
                  <MarketplaceBadge marketplace={product.marketplace} />
                </div>
                <h3 className="break-words text-sm font-bold leading-tight text-white">{product.product_name}</h3>
              </div>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-sm font-bold text-mint">
                {Math.round(product.opportunity_score)}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <MobileMetric label="Margem" value={`${Math.round(product.estimated_margin * 100)}%`} />
              <MobileMetric label="Lucro" value={`R$ ${product.estimated_profit.toFixed(2)}`} />
            </div>
            <button
              className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-ink"
              onClick={() => onInspect(product)}
              type="button"
            >
              Analise
            </button>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left text-sm">
          <thead className="text-xs uppercase text-mist">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Produto</th>
              <th className="px-3 py-2">Marketplace</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Margem</th>
              <th className="px-3 py-2">Lucro</th>
              <th className="px-3 py-2">Acao</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.product_id} className="bg-white/[0.035]">
                <td className="rounded-l-lg px-3 py-3 text-mint">{index + 1}</td>
                <td className="px-3 py-3 font-semibold text-white">{product.product_name}</td>
                <td className="px-3 py-3"><MarketplaceBadge marketplace={product.marketplace} /></td>
                <td className="px-3 py-3">{Math.round(product.opportunity_score)}</td>
                <td className="px-3 py-3">{Math.round(product.estimated_margin * 100)}%</td>
                <td className="px-3 py-3">R$ {product.estimated_profit.toFixed(2)}</td>
                <td className="rounded-r-lg px-3 py-3">
                  <button className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-ink" onClick={() => onInspect(product)} type="button">
                    Analise
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function MobileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-2">
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}
