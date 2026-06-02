import { ShieldAlert, ShieldCheck } from "lucide-react";

import { cn } from "../../lib/utils";
import { percent } from "../../services/format";

type RiskIndicatorProps = {
  value: number;
  compact?: boolean;
};

export function RiskIndicator({ value, compact = false }: RiskIndicatorProps) {
  const normalized = Math.max(0, Math.min(value, 100));
  const tone =
    normalized < 35
      ? { label: "Baixo", text: "text-mint", bar: "bg-mint", icon: ShieldCheck }
      : normalized < 58
        ? { label: "Médio", text: "text-ember", bar: "bg-ember", icon: ShieldAlert }
        : { label: "Alto", text: "text-rose-300", bar: "bg-rose-300", icon: ShieldAlert };
  const Icon = tone.icon;

  return (
    <div className="w-full min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={cn("inline-flex items-center gap-1.5 text-sm font-bold", tone.text)}>
          <Icon size={compact ? 14 : 16} />
          {tone.label}
        </span>
        <span className="text-xs font-bold text-white">{percent(normalized)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className={cn("h-full rounded-full", tone.bar)} style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
