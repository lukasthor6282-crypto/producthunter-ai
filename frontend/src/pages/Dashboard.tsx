import { AlertTriangle, LineChart, PackageSearch, TrendingUp } from 'lucide-react'
import { BentoGrid } from '../components/dashboard/BentoGrid'
import { StatsCard } from '../components/dashboard/StatsCard'
import { TrendChart } from '../components/charts/TrendChart'
import { MarginChart } from '../components/charts/MarginChart'
import { GlassPanel } from '../components/ui/GlassPanel'
import { ProductOpportunityCard } from '../components/product/ProductOpportunityCard'
import { useProducts } from '../hooks/useProducts'
import type { RecommendedProduct } from '../types/product'

interface DashboardProps {
  onInspect: (product: RecommendedProduct) => void
}

export function Dashboard({ onInspect }: DashboardProps) {
  const { dashboard, loading, usingMockData } = useProducts()
  const topProduct = dashboard.opportunities_today[0]

  return (
    <div className="space-y-4">
      {usingMockData && (
        <div className="rounded-lg border border-amber/25 bg-amber/10 px-4 py-3 text-sm text-amber">
          API ainda nao respondeu. O dashboard esta usando dados locais de demonstracao.
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Score geral do mercado" value={`${dashboard.market_score}`} helper="Media ponderada das oportunidades simuladas" icon={<LineChart size={19} />} />
        <StatsCard label="Oportunidades do dia" value={`${dashboard.opportunities_today.length}`} helper="Produtos com maior score agora" icon={<PackageSearch size={19} />} />
        <StatsCard label="Nichos aquecidos" value={`${dashboard.heated_niches.length}`} helper="Agrupados por score medio" icon={<TrendingUp size={19} />} />
        <StatsCard label="Alertas" value={`${dashboard.trend_alerts.length}`} helper="Sinais de tendencia para revisar" icon={<AlertTriangle size={19} />} />
      </div>
      <BentoGrid>
        <GlassPanel className="xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Produtos em alta</h2>
            <span className="text-xs text-mist">{loading ? 'Carregando...' : 'Atualizado pelo provider'}</span>
          </div>
          <TrendChart />
        </GlassPanel>
        <GlassPanel className="xl:col-span-5">
          <h2 className="text-xl font-bold text-white">Nichos aquecidos</h2>
          <div className="mt-4 space-y-3">
            {dashboard.heated_niches.map((item) => (
              <div key={item.niche}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-mist">{item.niche}</span>
                  <span className="font-semibold text-white">{item.score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-mint" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="xl:col-span-5">
          <h2 className="text-xl font-bold text-white">Melhor margem</h2>
          <MarginChart products={dashboard.best_margin_products} />
        </GlassPanel>
        <div className="xl:col-span-7">
          {topProduct && <ProductOpportunityCard product={topProduct} onInspect={onInspect} />}
        </div>
      </BentoGrid>
    </div>
  )
}

