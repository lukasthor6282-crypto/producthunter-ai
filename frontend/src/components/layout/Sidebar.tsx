import {
  BarChart3,
  Calculator,
  CreditCard,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Search,
  Store,
  Trophy,
  UserCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ComponentType } from "react";

import { cn } from "../../lib/utils";
import type { AuthUser } from "../../types/auth";

export type PageKey =
  | "landing"
  | "login"
  | "dashboard"
  | "profile"
  | "results"
  | "product"
  | "profit"
  | "billing"
  | "ai";

type SidebarProps = {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  mode?: "wide" | "compact";
  user?: AuthUser | null;
  onLogout?: () => void;
  isLoggingOut?: boolean;
};

type NavItem = {
  key?: PageKey;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  badge?: string;
};

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "Recomendar", icon: UserCircle2 },
  { key: "results", label: "Resultados", icon: Trophy, badge: "5" },
  { key: "profit", label: "Simulador", icon: Calculator },
  { key: "ai", label: "Lab de IA", icon: FlaskConical },
  { key: "billing", label: "Planos", icon: CreditCard },
];

export function Sidebar({ activePage, onNavigate, mode = "wide", user, onLogout, isLoggingOut }: SidebarProps) {
  const isCompact = mode === "compact";

  return (
    <aside
      className={cn(
        "fixed bottom-3 left-3 right-3 z-30 border border-white/10 bg-[#080b10]/98 shadow-[18px_0_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:bottom-auto lg:right-auto lg:top-0 lg:h-screen lg:border-y-0 lg:border-l-0 lg:bg-[#0a0d12]/95",
        isCompact ? "lg:w-16" : "lg:w-60",
        "rounded-lg lg:rounded-none",
      )}
    >
      <div className={cn("flex h-full items-center justify-between gap-2 p-2 lg:flex-col lg:items-stretch lg:p-0", isCompact ? "lg:px-3 lg:py-6" : "lg:p-4")}>
        <button
          onClick={() => onNavigate("landing")}
          aria-label="ProductHunter"
          className={cn("hidden items-center gap-3 rounded-lg transition hover:bg-white/[0.04] lg:flex", isCompact ? "justify-center p-0 lg:h-10" : "p-2")}
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200/25 bg-[linear-gradient(135deg,#f8fafc,#d9f99d_48%,#34d399)] text-[#07100d] shadow-[0_0_30px_rgba(52,211,153,0.22)]">
            <Store size={18} strokeWidth={2.4} />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#07100d]/15 bg-white text-[#07100d] shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
              <Search size={10} strokeWidth={3} />
            </span>
          </span>
          {!isCompact && (
            <span className="hidden text-left lg:block">
              <span className="block text-sm font-black leading-tight text-white">ProductHunter</span>
              <span className="block text-xs font-black leading-tight text-emerald-200">Commerce Radar</span>
            </span>
          )}
        </button>

        {!isCompact && <div className="hidden h-px bg-white/10 lg:block" />}

        <nav className={cn("grid flex-1 grid-cols-6 gap-1 lg:flex lg:flex-col", isCompact ? "lg:mt-7 lg:gap-3" : "lg:mt-5 lg:gap-2")}>
          {!isCompact && (
            <p className="hidden px-1 pb-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 lg:block">
              Navegação
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activePage;
            return (
              <button
                key={item.label}
                onClick={() => item.key && onNavigate(item.key)}
                disabled={!item.key}
                aria-label={item.label}
                title={item.label}
                className={cn(
                  "group relative flex h-11 items-center overflow-hidden rounded-lg text-sm font-bold transition duration-300 disabled:cursor-not-allowed disabled:opacity-65",
                  !item.key && "hidden lg:flex",
                  isCompact ? "justify-center" : "justify-center px-3 lg:justify-start lg:gap-3",
                  isActive
                    ? "border border-cyan-300/28 bg-cyan-300/[0.12] text-cyan-200 shadow-[0_0_24px_rgba(98,230,255,0.12)]"
                    : "border border-transparent text-slate-400 hover:bg-white/[0.045] hover:text-white",
                )}
              >
                {isActive && !isCompact && (
                  <motion.span
                    layoutId="kombai-sidebar-rail"
                    className="absolute left-0 top-2 hidden h-7 w-1 rounded-r-full bg-cyan-300 lg:block"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={18} className="shrink-0" />
                {!isCompact && <span className="hidden lg:inline">{item.label}</span>}
                {!isCompact && item.badge && item.key === "results" && (
                  <span className="ml-auto hidden rounded-full bg-emerald-300/20 px-2 py-0.5 text-[10px] font-black text-emerald-200 lg:inline">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={cn("hidden border-t border-white/10 pt-4 lg:block", isCompact && "mx-auto w-10")}>
          {isCompact ? (
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
              title="Dashboard"
            >
              <Search size={17} />
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.07] text-cyan-200">
                {user?.picture_url ? (
                  <img src={user.picture_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserCircle2 size={18} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{user?.name ?? "Cliente ProductHunter"}</p>
                <p className="truncate text-xs font-semibold text-slate-500">{user?.email ?? "Conta Google"}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                aria-label="Sair"
                title="Sair"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] text-slate-400 transition hover:border-ember/30 hover:bg-ember/10 hover:text-ember disabled:opacity-50"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
