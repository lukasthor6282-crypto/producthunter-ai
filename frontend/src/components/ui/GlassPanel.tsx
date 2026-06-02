import type { PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

type GlassPanelProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  variant?: "default" | "strong" | "electric" | "mint" | "ember" | "violet";
}>;

const variantClasses: Record<NonNullable<GlassPanelProps["variant"]>, string> = {
  default: "",
  strong: "glass-strong",
  electric: "glass-electric",
  mint: "glass-mint",
  ember: "glass-ember",
  violet: "glass-violet",
};

export function GlassPanel({ children, className, contentClassName, variant = "default" }: GlassPanelProps) {
  return (
    <div className={cn("glass-surface min-w-0 rounded-lg", variantClasses[variant], className)}>
      <div className={cn("glass-content", contentClassName)}>{children}</div>
    </div>
  );
}
