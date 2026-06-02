import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { SpatialBackground } from './components/animation/SpatialBackground'
import { Header } from './components/layout/Header'
import { type AppView, Sidebar } from './components/layout/Sidebar'
import { mockRecommendations } from './data/mockStaticData'
import { useRecommendations } from './hooks/useRecommendations'
import { AILab } from './pages/AILab'
import { CompareProducts } from './pages/CompareProducts'
import { Dashboard } from './pages/Dashboard'
import { LandingPage } from './pages/LandingPage'
import { ProductDetail } from './pages/ProductDetail'
import { ProfitSimulator } from './pages/ProfitSimulator'
import { RecommendationProfile } from './pages/RecommendationProfile'
import { RecommendationResultsPage } from './pages/RecommendationResults'
import type { RecommendedProduct } from './types/product'
import type { UserProfile } from './types/userProfile'

const mobileViews: Array<{ view: AppView; label: string }> = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'profile', label: 'Perfil' },
  { view: 'results', label: 'Ranking' },
  { view: 'detail', label: 'Produto' },
  { view: 'compare', label: 'Comparar' },
  { view: 'profit', label: 'Lucro' },
  { view: 'lab', label: 'IA' },
]

function App() {
  const [activeView, setActiveView] = useState<AppView>('dashboard')
  const [selectedProduct, setSelectedProduct] = useState<RecommendedProduct>(mockRecommendations[0])
  const { data, loading, error, usingMockData, generate } = useRecommendations()
  const products = useMemo(
    () => (data.recommended_products.length > 0 ? data.recommended_products : mockRecommendations),
    [data.recommended_products],
  )

  async function handleGenerate(profile: UserProfile) {
    const response = await generate(profile)
    if (response.recommended_products[0]) {
      setSelectedProduct(response.recommended_products[0])
    }
    setActiveView('results')
  }

  function inspectProduct(product: RecommendedProduct) {
    setSelectedProduct(product)
    setActiveView('detail')
  }

  return (
    <main className="min-h-screen text-white">
      <SpatialBackground />
      <div className="mx-auto flex w-full max-w-[1540px] gap-4 px-3 py-3 sm:px-4 sm:py-4">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />
        <div className="min-w-0 flex-1">
          <Header activeView={activeView} usingMockData={usingMockData} onPrimaryAction={() => setActiveView('profile')} />
          <div className="mb-4 grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 lg:hidden">
            {mobileViews.map((item) => (
              <button
                key={item.view}
                className={`min-h-10 rounded-lg border px-2 py-2 text-xs font-semibold transition min-[380px]:text-sm ${
                  activeView === item.view ? 'border-mint bg-mint text-ink' : 'border-line bg-white/[0.04] text-mist'
                }`}
                onClick={() => setActiveView(item.view)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          {error && (
            <div className="mb-4 rounded-lg border border-amber/25 bg-amber/10 px-4 py-3 text-sm text-amber">
              {error}
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24 }}
            >
              {activeView === 'landing' && <LandingPage onStart={() => setActiveView('profile')} />}
              {activeView === 'dashboard' && <Dashboard onInspect={inspectProduct} />}
              {activeView === 'profile' && (
                <RecommendationProfile loading={loading} narrative={data.narrative} onSubmit={handleGenerate} />
              )}
              {activeView === 'results' && (
                <RecommendationResultsPage narrative={data.narrative} products={products} onInspect={inspectProduct} />
              )}
              {activeView === 'detail' && <ProductDetail product={selectedProduct} />}
              {activeView === 'compare' && <CompareProducts products={products} />}
              {activeView === 'profit' && <ProfitSimulator />}
              {activeView === 'lab' && <AILab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

export default App
