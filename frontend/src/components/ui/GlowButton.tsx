import type { PropsWithChildren } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "../../lib/utils";

type GlowButtonProps = PropsWithChildren<HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
}>;

export function GlowButton({ children, className = "", variant = "primary", ...props }: GlowButtonProps) {
  const styles = {
    primary:
      "bg-[linear-gradient(135deg,#ffffff,#b9fbff_48%,#65f0b7)] text-obsidian shadow-[0_0_34px_rgba(98,230,255,0.24)] hover:shadow-[0_0_42px_rgba(101,240,183,0.28)]",
    secondary:
      "border border-white/12 bg-white/[0.065] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-electric/40 hover:bg-white/[0.105]",
    ghost: "text-mist hover:bg-white/[0.07] hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex min-h-11 max-w-full items-center justify-center gap-2 overflow-hidden rounded-md px-4 py-2 text-center text-sm font-semibold transition duration-300 before:absolute before:inset-0 before:translate-x-[-120%] before:bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.28),transparent)] before:transition-transform before:duration-700 hover:before:translate-x-[120%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/60 disabled:pointer-events-none disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
