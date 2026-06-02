import { useMemo, useState } from 'react'
import { ComparisonTable } from '../components/product/ComparisonTable'
import { GlassPanel } from '../components/ui/GlassPanel'
import type { RecommendedProduct } from '../types/product'

interface CompareProductsProps {
  products: RecommendedProduct[]
}

export function CompareProducts({ products }: CompareProductsProps) {
  const [selectedIds, setSelectedIds] = useState(() => products.slice(0, 3).map((product) => product.product_id))
  const selected = useMemo(
    () => products.filter((product) => selectedIds.includes(product.product_id)).slice(0, 5),
    [products, selectedIds],
  )

  return (
    <div className="space-y-4">
      <GlassPanel>
        <h2 className="text-xl font-bold text-white">Escolha ate cinco produtos</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {products.map((product) => (
            <button
              key={product.product_id}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                selectedIds.includes(product.product_id)
                  ? 'border-mint bg-mint text-ink'
                  : 'border-line bg-white/[0.035] text-mist hover:text-white'
              }`}
              onClick={() =>
                setSelectedIds((current) =>
                  current.includes(product.product_id)
                    ? current.filter((id) => id !== product.product_id)
                    : [...current, product.product_id].slice(-5),
                )
              }
              type="button"
            >
              {product.product_name}
            </button>
          ))}
        </div>
      </GlassPanel>
      <ComparisonTable products={selected} />
    </div>
  )
}

