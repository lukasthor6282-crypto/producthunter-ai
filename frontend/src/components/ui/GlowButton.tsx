import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export function GlowButton({ children, className, variant = 'primary', ...props }: GlowButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition',
        'focus:outline-none focus:ring-2 focus:ring-mint/60 focus:ring-offset-2 focus:ring-offset-ink',
        variant === 'primary'
          ? 'bg-mint text-ink shadow-glow hover:bg-cyan'
          : 'border border-line bg-white/5 text-white hover:border-mint/50 hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
