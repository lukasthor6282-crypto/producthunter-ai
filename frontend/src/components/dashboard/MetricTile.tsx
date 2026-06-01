import type { ReactNode } from "react";

export function MetricTile({ icon, label, value, accent = "text-electric" }: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="glass-surface group rounded-lg p-4 transition duration-300 hover:-translate-y-1 hover:border-electric/25">
      <div className="glass-content">
        <div className={`mb-4 inline-flex rounded-md border border-white/10 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition group-hover:scale-105 ${accent}`}>{icon}</div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mist">{label}</p>
        <p className="mt-2 text-2xl font-bold text-white md:text-3xl">{value}</p>
      </div>
    </div>
  );
}
