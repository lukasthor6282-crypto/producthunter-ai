import { ArrowRight, Sparkles } from 'lucide-react'
import { API_BASE_URL } from '../../services/api'
import type { AppView } from './Sidebar'
import { GlowButton } from '../ui/GlowButton'

interface HeaderProps {
  activeView: AppView
  usingMockData: boolean
  onPrimaryAction: () => void
}

const titles: Record<AppView, string> = {
  landing: 'Landing Page',
  dashboard: 'Dashboard',
  profile: 'Perfil de Recomendacao',
  results: 'Resultado da Recomendacao',
  detail: 'Analise Individual do Produto',
  compare: 'Comparacao de Produtos',
  profit: 'Simulador de Lucro',
  lab: 'Laboratorio de IA',
}

export function Header({ activeView, usingMockData, onPrimaryAction }: HeaderProps) {
  return (
    <header className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-mint">ProductHunter AI</p>
        <h1 className="mt-1 break-words text-2xl font-bold leading-tight text-white sm:text-3xl">{titles[activeView]}</h1>
      </div>
      <div className="grid w-full grid-cols-1 gap-2 min-[460px]:grid-cols-[auto_1fr] sm:w-auto sm:flex sm:flex-wrap sm:items-center">
        <span className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-line bg-white/[0.04] px-3 py-2 text-xs text-mist sm:justify-start">
          <Sparkles size={14} className="text-mint" />
          {usingMockData ? 'Demo local' : `API ${API_BASE_URL}`}
        </span>
        <GlowButton className="w-full whitespace-nowrap sm:w-auto" onClick={onPrimaryAction}>
          Encontrar produtos <ArrowRight size={16} />
        </GlowButton>
      </div>
    </header>
  )
}
