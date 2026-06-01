import { BadgeCheck } from "lucide-react";

import { cn } from "../../lib/utils";

type MarketplaceBadgeProps = {
  marketplace: string;
  label: string;
  className?: string;
};

const marketplaceTone: Record<string, string> = {
  shopee: "border-orange-300/20 bg-orange-300/10 text-orange-200",
  amazon: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  mercado_livre: "border-yellow-300/20 bg-yellow-300/10 text-yellow-100",
  aliexpress: "border-rose-300/20 bg-rose-300/10 text-rose-200",
  tiktok_shop: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  magalu: "border-blue-300/20 bg-blue-300/10 text-blue-100",
  shein: "border-white/15 bg-white/[0.08] text-white",
};

export function MarketplaceBadge({ marketplace, label, className }: MarketplaceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold",
        marketplaceTone[marketplace] ?? "border-electric/20 bg-electric/10 text-electric",
        className,
      )}
    >
      <BadgeCheck size={13} />
      {label}
    </span>
  );
}
