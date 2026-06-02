import { BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'

interface AIExplanationPanelProps {
  narrative: string
}

export function AIExplanationPanel({ narrative }: AIExplanationPanelProps) {
  return (
    <GlassPanel>
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-cyan/15 p-3 text-cyan"><BrainCircuit size={22} /></span>
        <div>
          <h2 className="text-xl font-bold text-white">Explicacao da IA</h2>
          <p className="text-sm text-mist">Consultoria gerada a partir do perfil e do catalogo simulado.</p>
        </div>
      </div>
      <p className="mt-5 rounded-lg border border-line bg-white/[0.035] p-4 text-sm leading-6 text-mist">{narrative}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-white/[0.035] p-3">
          <Sparkles className="mb-2 text-mint" size={18} />
          <p className="text-sm font-semibold text-white">Score ponderado</p>
          <p className="mt-1 text-xs leading-5 text-mist">Lucro, margem, demanda, tendencia, concorrencia, risco e conversao entram com pesos diferentes por perfil.</p>
        </div>
        <div className="rounded-lg border border-line bg-white/[0.035] p-3">
          <ShieldCheck className="mb-2 text-amber" size={18} />
          <p className="text-sm font-semibold text-white">MVP sem scraping</p>
          <p className="mt-1 text-xs leading-5 text-mist">A camada de dados nasce simulada e esta pronta para CSVs, APIs oficiais e fontes autorizadas.</p>
        </div>
      </div>
    </GlassPanel>
  )
}

