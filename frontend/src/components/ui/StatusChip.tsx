import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

type StatusChipProps = {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "electric" | "mint" | "ember" | "violet" | "muted";
  className?: string;
};

const toneClasses: Record<NonNullable<StatusChipProps["tone"]>, string> = {
  electric: "border-electric/25 bg-electric/10 text-electric",
  mint: "border-mint/25 bg-mint/10 text-mint",
  ember: "border-ember/25 bg-ember/10 text-ember",
  violet: "border-violet/25 bg-violet/10 text-violet-200",
  muted: "border-white/10 bg-white/[0.065] text-mist",
};

export function StatusChip({ children, icon, tone = "muted", className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
