import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";
import { GlassCard } from "./GlassCard";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
  className?: string;
};

export function FeatureCard({ icon, title, text, className }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
      <GlassCard className={cn("h-full p-5", className)} interactive>
        <div className="mb-5 inline-flex rounded-md border border-electric/20 bg-electric/10 p-3 text-electric shadow-[0_0_28px_rgba(98,230,255,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {icon}
        </div>
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
      </GlassCard>
    </motion.div>
  );
}
