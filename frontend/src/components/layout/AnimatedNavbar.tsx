import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Calculator, Compass, Search, Sparkles, Store } from "lucide-react";

import type { PageKey } from "./Sidebar";
import { GlowButton } from "../ui/GlowButton";

type AnimatedNavbarProps = {
  onNavigate: (page: PageKey) => void;
  onStart: () => void;
};

const links: Array<{ label: string; page: PageKey }> = [
  { label: "Dashboard", page: "dashboard" },
  { label: "Perfil", page: "profile" },
  { label: "Ranking", page: "results" },
  { label: "AI Lab", page: "ai" },
];

export function AnimatedNavbar({ onNavigate, onStart }: AnimatedNavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl lg:hidden"
    >
      <button
        type="button"
        onClick={() => onNavigate("landing")}
        className="flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition hover:bg-white/[0.06]"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-md border border-emerald-200/25 bg-[linear-gradient(135deg,#f8fafc,#d9f99d_48%,#34d399)] text-[#07100d] shadow-[0_0_28px_rgba(52,211,153,0.2)]">
          <Store size={18} strokeWidth={2.4} />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#07100d]/15 bg-white text-[#07100d] shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
            <Search size={10} strokeWidth={3} />
          </span>
        </span>
        <span>
          <span className="block text-sm font-extrabold text-white">ProductHunter</span>
          <span className="block text-xs font-medium text-mist">Commerce Radar</span>
        </span>
      </button>

      <div className="hidden items-center gap-1 md:flex">
        {links.map((link) => (
          <button
            key={link.page}
            type="button"
            onClick={() => onNavigate(link.page)}
            className="rounded-md px-3 py-2 text-sm font-semibold text-mist transition hover:bg-white/[0.07] hover:text-white"
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-mist">
          <BarChart3 size={14} className="text-mint" />
          420 produtos
        </span>
        <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-mist">
          <BrainCircuit size={14} className="text-electric" />
          ML explicável
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("profit")}
          aria-label="Abrir simulador"
          className="hidden h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-ember transition hover:border-ember/35 hover:bg-ember/10 sm:flex"
        >
          <Calculator size={17} />
        </button>
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          aria-label="Abrir perfil"
          className="hidden h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-electric transition hover:border-electric/35 hover:bg-electric/10 sm:flex"
        >
          <Compass size={17} />
        </button>
        <GlowButton onClick={onStart} className="min-h-10 px-3">
          <Sparkles size={16} />
          <span className="hidden sm:inline">Encontrar produtos</span>
        </GlowButton>
      </div>
    </motion.nav>
  );
}
