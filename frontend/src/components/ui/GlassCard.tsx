import type { PropsWithChildren } from "react";
import type { MouseEvent } from "react";

import { cn } from "../../lib/utils";

type GlassCardProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  as?: "section" | "article" | "div";
  variant?: "default" | "strong" | "electric" | "mint" | "ember" | "violet";
  interactive?: boolean;
}>;

const variantClasses: Record<NonNullable<GlassCardProps["variant"]>, string> = {
  default: "",
  strong: "glass-strong",
  electric: "glass-electric",
  mint: "glass-mint",
  ember: "glass-ember",
  violet: "glass-violet",
};

export function GlassCard({
  children,
  className,
  contentClassName,
  as: Comp = "section",
  variant = "default",
  interactive = false,
}: GlassCardProps) {
  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  };

  return (
    <Comp
      className={cn("glass-surface rounded-lg", variantClasses[variant], interactive && "spotlight-card transition duration-300 hover:border-electric/30", className)}
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <div className={cn("glass-content", contentClassName)}>{children}</div>
    </Comp>
  );
}
