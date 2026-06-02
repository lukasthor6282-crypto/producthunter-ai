interface RiskIndicatorProps {
  risk: number
}

export function RiskIndicator({ risk }: RiskIndicatorProps) {
  const value = Math.max(0, Math.min(100, risk))
  const label = value < 35 ? 'Baixo' : value < 62 ? 'Medio' : 'Alto'
  const color = value < 35 ? 'bg-mint' : value < 62 ? 'bg-amber' : 'bg-danger'

  return (
    <div className="w-full min-w-0">
      <div className="mb-1 flex items-center justify-between text-xs text-mist">
        <span>Risco {label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
