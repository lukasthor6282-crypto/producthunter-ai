import type { RecommendedProduct } from '../../types/product'
import { ProductOpportunityCard } from '../product/ProductOpportunityCard'

interface RecommendationResultsProps {
  products: RecommendedProduct[]
  onInspect: (product: RecommendedProduct) => void
}

export function RecommendationResults({ products, onInspect }: RecommendationResultsProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-white/[0.035] p-6 text-center text-mist">
        Nenhuma recomendacao encontrada para este filtro.
      </div>
    )
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {products.map((product) => (
        <ProductOpportunityCard key={product.product_id} product={product} onInspect={onInspect} />
      ))}
    </div>
  )
}

