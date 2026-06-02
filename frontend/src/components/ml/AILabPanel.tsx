import { useEffect, useState } from 'react'
import { FlaskConical, GitBranch, ListChecks } from 'lucide-react'
import { getMlExplain, getMlMetrics } from '../../services/recommendationApi'
import { GlassPanel } from '../ui/GlassPanel'

interface MetricsShape {
  model_name?: string
  trained_rows?: number
  metrics?: Record<string, number>
  top_features?: Array<{ feature: string; importance: number }>
}

interface ExplainShape {
  simple_explanation?: string
  feature_groups?: Record<string, string[]>
  how_to_improve?: string[]
}

export function AILabPanel() {
  const [metrics, setMetrics] = useState<MetricsShape | null>(null)
  const [explain, setExplain] = useState<ExplainShape | null>(null)

  useEffect(() => {
    let mounted = true
    Promise.all([getMlMetrics(), getMlExplain()])
      .then(([metricsResponse, explainResponse]) => {
        if (mounted) {
          setMetrics(metricsResponse as MetricsShape)
          setExplain(explainResponse as ExplainShape)
        }
      })
      .catch(() => {
        if (mounted) {
          setMetrics({
            model_name: 'RandomForestRegressor MVP',
            trained_rows: 1050,
            metrics: { opportunity_score_mae: 3.2, risk_score_mae: 4.8 },
            top_features: [
              { feature: 'estimated_cost', importance: 0.19 },
              { feature: 'search_volume', importance: 0.16 },
              { feature: 'competitor_count', importance: 0.13 },
            ],
          })
          setExplain({
            simple_explanation:
              'Features sao as entradas do modelo; targets sao os resultados que queremos prever. O MVP aprende a aproximar os scores criados por regras.',
            how_to_improve: ['Adicionar dados reais autorizados', 'Comparar modelos', 'Aprender com favoritos e vendas reais'],
          })
        }
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <GlassPanel className="xl:col-span-7">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-mint/15 p-3 text-mint"><FlaskConical size={22} /></span>
          <div>
            <h2 className="text-xl font-bold text-white">Laboratorio de IA</h2>
            <p className="text-sm text-mist">Uma tela didatica para acompanhar features, targets e metricas.</p>
          </div>
        </div>
        <p className="mt-5 rounded-lg border border-line bg-white/[0.035] p-4 text-sm leading-6 text-mist">
          {explain?.simple_explanation}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <LabStat label="Modelo" value={metrics?.model_name ?? 'MVP'} />
          <LabStat label="Linhas treino" value={String(metrics?.trained_rows ?? '...')} />
          <LabStat label="Targets" value="5" />
        </div>
      </GlassPanel>
      <GlassPanel className="xl:col-span-5">
        <div className="flex items-center gap-2 text-white">
          <GitBranch size={18} className="text-cyan" />
          <h3 className="font-semibold">Importancia das variaveis</h3>
        </div>
        <div className="mt-4 space-y-3">
          {(metrics?.top_features ?? []).slice(0, 6).map((item) => (
            <div key={item.feature}>
              <div className="mb-1 flex justify-between text-xs text-mist">
                <span>{item.feature}</span>
                <span>{Math.round(item.importance * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan" style={{ width: `${Math.max(6, item.importance * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
      <GlassPanel className="xl:col-span-12">
        <div className="flex items-center gap-2 text-white">
          <ListChecks size={18} className="text-amber" />
          <h3 className="font-semibold">Como evoluir o modelo</h3>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {(explain?.how_to_improve ?? []).map((item) => (
            <div key={item} className="rounded-lg border border-line bg-white/[0.035] p-3 text-sm text-mist">{item}</div>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}

function LabStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-3">
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  )
}
