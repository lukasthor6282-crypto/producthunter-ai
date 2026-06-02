import clsx from 'clsx'
import type { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <section className={clsx('glass-surface min-w-0 rounded-lg p-4 sm:p-5', className)}>
      {children}
    </section>
  )
}
