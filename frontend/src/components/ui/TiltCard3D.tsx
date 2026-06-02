import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useMouseTilt } from '../../hooks/useMouseTilt'

interface TiltCard3DProps {
  children: ReactNode
  className?: string
}

export function TiltCard3D({ children, className }: TiltCard3DProps) {
  const [cardRef, handleMouseMove, handleMouseLeave] = useMouseTilt()

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        'tilt-preserve relative min-w-0 overflow-hidden rounded-lg transition-transform duration-300 ease-out',
        'before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300',
        'before:bg-[radial-gradient(circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(129,243,200,0.23),transparent_32%)] hover:before:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}
