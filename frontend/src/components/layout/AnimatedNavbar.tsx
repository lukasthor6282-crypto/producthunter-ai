import { motion } from 'framer-motion'
import { ArrowRight, Bot } from 'lucide-react'
import { GlowButton } from '../ui/GlowButton'

interface AnimatedNavbarProps {
  onOpenApp: () => void
}

export function AnimatedNavbar({ onOpenApp }: AnimatedNavbarProps) {
  return (
    <motion.nav
      className="flex items-center justify-between rounded-lg border border-line bg-white/[0.04] px-4 py-3 backdrop-blur-xl"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55 }}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint text-ink">
          <Bot size={19} />
        </span>
        <span className="font-bold text-white">ProductHunter AI</span>
      </div>
      <GlowButton onClick={onOpenApp} className="hidden sm:inline-flex">
        Abrir app <ArrowRight size={16} />
      </GlowButton>
    </motion.nav>
  )
}

