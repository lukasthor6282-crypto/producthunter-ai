import { BrainCircuit, Database, ScanSearch, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const steps = ["perfil", "margem", "risco", "ranking"];

export function AIAnalysisLoader() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-electric/25 bg-[linear-gradient(135deg,rgba(98,230,255,0.14),rgba(255,255,255,0.055),rgba(101,240,183,0.09))] p-4 shadow-[0_0_52px_rgba(98,230,255,0.16)]">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(98,230,255,0.8),rgba(101,240,183,0.45),transparent)]" />
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-electric/30 bg-electric/10 text-electric"
        >
          <BrainCircuit size={22} />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.45 }}
            className="absolute -right-1 -top-1 text-mint"
          >
            <Sparkles size={13} />
          </motion.span>
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-extrabold text-white">IA montando o ranking</p>
              <p className="mt-1 text-sm leading-6 text-mist">Cruzando perfil, marketplace, margem, conversão e risco operacional.</p>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-mint/20 bg-mint/10 px-3 py-2 text-xs font-bold text-mint sm:flex">
              <Database size={14} />
              dados simulados
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.18 }}
                className="rounded-md border border-white/10 bg-white/[0.055] px-3 py-2"
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-mist">
                  <ScanSearch size={12} className="text-electric" />
                  {step}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.25, delay: index * 0.16 }}
                    className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#62e6ff,#65f0b7)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
