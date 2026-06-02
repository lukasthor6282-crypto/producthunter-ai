import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, Sparkles, Store } from 'lucide-react'
import conceptImage from '../assets/producthunter-ai-concept.png'
import { AnimatedNavbar } from '../components/layout/AnimatedNavbar'
import { FeatureCard } from '../components/dashboard/FeatureCard'
import { GlassPanel } from '../components/ui/GlassPanel'
import { GlowButton } from '../components/ui/GlowButton'

interface LandingPageProps {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="space-y-10">
      <AnimatedNavbar onOpenApp={onStart} />
      <section className="grid min-h-[72vh] items-center gap-8 py-8 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <motion.h1
            className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl"
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65 }}
          >
            A IA que encontra os melhores produtos para o seu perfil de venda.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl text-base leading-7 text-mist sm:text-lg"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.65 }}
          >
            Informe onde voce vende, seu nicho e objetivo. O ProductHunter AI recomenda os produtos com maior chance
            de lucro, conversao e oportunidade.
          </motion.p>
          <div className="mt-7 flex flex-wrap gap-3">
            <GlowButton onClick={onStart}>Encontrar produtos <ArrowRight size={17} /></GlowButton>
            <GlowButton variant="ghost" onClick={onStart}>Ver dashboard</GlowButton>
          </div>
        </div>
        <motion.div
          className="xl:col-span-7"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.7 }}
        >
          <div className="glass-surface overflow-hidden rounded-lg p-2">
            <img className="block w-full rounded-lg object-cover" src={conceptImage} alt="ProductHunter AI dashboard concept" />
          </div>
        </motion.div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="Para vendedores" description="Prioriza margem, lucro, frete, concorrencia, giro e risco logistico." icon={<Store size={22} />} />
        <FeatureCard title="Para afiliados" description="Encontra produtos visuais, com comissao, conversao e potencial para videos curtos." icon={<Sparkles size={22} />} />
        <FeatureCard title="Motor didatico" description="Combina regras e Machine Learning inicial para voce aprender enquanto constrói." icon={<BrainCircuit size={22} />} />
      </section>
      <GlassPanel>
        <div className="grid gap-5 md:grid-cols-3">
          {['Plano Free com recomendacoes limitadas', 'Plano Pro com comparacoes e favoritos', 'Plano Business com API e relatorios'].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-mist">
              <CheckCircle2 size={18} className="text-mint" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </GlassPanel>
      <GlassPanel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pronto para validar oportunidades?</h2>
          <p className="mt-2 text-sm text-mist">Comece pelo perfil e veja um ranking com score, margem, risco e explicacao.</p>
        </div>
        <GlowButton onClick={onStart}><BarChart3 size={17} /> Abrir cockpit</GlowButton>
      </GlassPanel>
    </div>
  )
}

