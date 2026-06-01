import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "electric" | "mint" | "ember" | "violet" | "white";
  className?: string;
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  electric: "text-electric",
  mint: "text-mint",
  ember: "text-ember",
  violet: "text-violet-200",
  white: "text-white",
};

export function MetricCard({ label, value, detail, icon, tone = "white", className }: MetricCardProps) {
  return (
    <div className={cn("metric-panel p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-mist">{label}</p>
          <p className={cn("mono-number mt-2 text-xl font-extrabold", toneClasses[tone])}>{value}</p>
          {detail && <p className="mt-1 text-xs leading-5 text-mist">{detail}</p>}
        </div>
        {icon && <span className={cn("rounded-md bg-white/[0.06] p-2", toneClasses[tone])}>{icon}</span>}
      </div>
    </div>
  );
}
