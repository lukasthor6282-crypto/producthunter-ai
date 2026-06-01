import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { GlassCard } from "./GlassCard";

type StatsCardProps = {
  icon?: ReactNode;
  label: string;
  value: string;
  detail?: string;
  tone?: "electric" | "mint" | "ember" | "violet" | "rose";
  className?: string;
};

const toneClasses: Record<NonNullable<StatsCardProps["tone"]>, string> = {
  electric: "text-electric",
  mint: "text-mint",
  ember: "text-ember",
  violet: "text-violet-300",
  rose: "text-rose-300",
};

const toneVariants: Record<NonNullable<StatsCardProps["tone"]>, "electric" | "mint" | "ember" | "violet" | "default"> = {
  electric: "electric",
  mint: "mint",
  ember: "ember",
  violet: "violet",
  rose: "default",
};

export function StatsCard({ icon, label, value, detail, tone = "electric", className }: StatsCardProps) {
  return (
    <GlassCard className={cn("p-4", className)} variant={toneVariants[tone]} interactive>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mist">{label}</p>
          <p className={cn("mono-number mt-2 text-2xl font-extrabold text-white md:text-3xl", toneClasses[tone])}>{value}</p>
          {detail && <p className="mt-2 text-sm leading-6 text-mist">{detail}</p>}
        </div>
        {icon && (
          <div className={cn("rounded-md border border-white/10 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]", toneClasses[tone])}>
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
