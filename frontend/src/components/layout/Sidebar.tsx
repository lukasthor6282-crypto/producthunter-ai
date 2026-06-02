import clsx from 'clsx'
import {
  BarChart3,
  Bot,
  Calculator,
  Columns3,
  FlaskConical,
  Home,
  LayoutDashboard,
  SearchCheck,
  Trophy,
} from 'lucide-react'

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'profile'
  | 'results'
  | 'detail'
  | 'compare'
  | 'profit'
  | 'lab'

interface SidebarProps {
  activeView: AppView
  onChangeView: (view: AppView) => void
}

const navItems = [
  { view: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { view: 'profile' as const, label: 'Perfil de Recomendacao', icon: SearchCheck },
  { view: 'results' as const, label: 'Ranking', icon: Trophy },
  { view: 'detail' as const, label: 'Analise individual', icon: BarChart3 },
  { view: 'compare' as const, label: 'Comparacao', icon: Columns3 },
  { view: 'profit' as const, label: 'Simulador', icon: Calculator },
  { view: 'lab' as const, label: 'Laboratorio de IA', icon: FlaskConical },
  { view: 'landing' as const, label: 'Landing', icon: Home },
]

export function Sidebar({ activeView, onChangeView }: SidebarProps) {
  return (
    <aside className="glass-surface sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-lg p-4 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-ink">
          <Bot size={22} />
        </span>
        <div>
          <p className="font-bold text-white">ProductHunter AI</p>
          <p className="text-xs text-mist">Recommendation cockpit</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            className={clsx(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition',
              activeView === item.view
                ? 'bg-mint text-ink'
                : 'text-mist hover:bg-white/10 hover:text-white',
            )}
            onClick={() => onChangeView(item.view)}
            type="button"
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
