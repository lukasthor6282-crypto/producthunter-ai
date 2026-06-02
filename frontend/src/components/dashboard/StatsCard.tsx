import type { ReactNode } from 'react'
import { GlassCard } from '../ui/GlassCard'

interface StatsCardProps {
  label: string
  value: string
  helper: string
  icon: ReactNode
}

export function StatsCard({ label, value, helper, icon }: StatsCardProps) {
  return (
    <GlassCard className="p-4">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-mist">{label}</span>
        <span className="rounded-lg bg-white/10 p-2 text-mint">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-xs text-mist">{helper}</p>
    </GlassCard>
  )
}
