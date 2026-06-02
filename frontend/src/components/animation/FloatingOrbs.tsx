import { motion } from 'framer-motion'

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="mesh-ribbon left-[-18vw] top-[8vh]"
        animate={{ x: [0, 34, 0], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="mesh-ribbon right-[-22vw] top-[36vh]"
        animate={{ x: [0, -30, 0], opacity: [0.13, 0.24, 0.13] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="mesh-ribbon bottom-[6vh] left-[18vw]"
        animate={{ y: [0, -22, 0], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

