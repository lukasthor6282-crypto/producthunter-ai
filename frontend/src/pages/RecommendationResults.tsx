import type { RecommendedProduct } from '../types/product'
import { AIExplanationPanel } from '../components/recommendation/AIExplanationPanel'
import { ProductRankingTable } from '../components/recommendation/ProductRankingTable'
import { RecommendationResults as ResultsGrid } from '../components/recommendation/RecommendationResults'
import { GlassPanel } from '../components/ui/GlassPanel'

interface RecommendationResultsPageProps {
  narrative: string
  products: RecommendedProduct[]
  onInspect: (product: RecommendedProduct) => void
}

export function RecommendationResultsPage({ narrative, products, onInspect }: RecommendationResultsPageProps) {
  return (
    <div className="space-y-4">
      <AIExplanationPanel narrative={narrative} />
      <ResultsGrid products={products} onInspect={onInspect} />
      <GlassPanel>
        <h2 className="mb-4 text-xl font-bold text-white">Ranking visual de produtos</h2>
        <ProductRankingTable products={products} onInspect={onInspect} />
      </GlassPanel>
    </div>
  )
}

