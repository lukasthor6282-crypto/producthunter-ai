import { motion } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'

export function AIAnalysisLoader() {
  return (
    <GlassCard className="flex items-center gap-4 p-4">
      <motion.div
        className="rounded-lg bg-mint/15 p-3 text-mint"
        animate={{ scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BrainCircuit size={24} />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-white">Analisando nicho, concorrencia, margem, demanda e conversao...</p>
        <p className="text-xs text-mist">O motor combina regras de negocio com previsoes iniciais de ML.</p>
      </div>
    </GlassCard>
  )
}

