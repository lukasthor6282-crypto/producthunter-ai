import { motion } from 'framer-motion'
import { Bot, ChartSpline, Coins, Sparkles, Store } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const icons = [Bot, ChartSpline, Coins, Store, Sparkles]

export function FloatingIconLayer() {
  const reduced = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {icons.map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute rounded-lg border border-line bg-white/[0.035] p-2 text-mint/50 backdrop-blur"
          style={{ left: `${18 + index * 15}%`, top: `${18 + (index % 3) * 20}%` }}
          animate={reduced ? undefined : { y: [0, -10, 0], opacity: [0.28, 0.5, 0.28] }}
          transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </motion.div>
      ))}
    </div>
  )
}

