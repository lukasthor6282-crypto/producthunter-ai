import type { ReactNode } from 'react'
import { GlassCard } from '../ui/GlassCard'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <GlassCard className="p-4">
      <div className="mb-4 inline-flex rounded-lg bg-white/10 p-2 text-mint">{icon}</div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-mist">{description}</p>
    </GlassCard>
  )
}
