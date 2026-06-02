import clsx from 'clsx'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return <div className={clsx('glass-surface rounded-lg', className)}>{children}</div>
}

