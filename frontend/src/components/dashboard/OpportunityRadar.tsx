import { Activity, Crosshair, Radar } from "lucide-react";
import { useMemo } from "react";

import { cn } from "../../lib/utils";

type RadarSignal = {
  label: string;
  value: number;
  tone?: "cyan" | "mint" | "amber" | "violet";
};

type OpportunityRadarProps = {
  score?: number;
  title?: string;
  subtitle?: string;
  signals?: RadarSignal[];
  className?: string;
  compact?: boolean;
};

const defaultSignals: RadarSignal[] = [
  { label: "Nicho", value: 91, tone: "mint" },
  { label: "Verba", value: 84, tone: "cyan" },
  { label: "Margem", value: 78, tone: "mint" },
  { label: "Demanda", value: 86, tone: "violet" },
  { label: "Risco", value: 64, tone: "amber" },
  { label: "Conversao", value: 73, tone: "cyan" },
];

const toneClasses: Record<NonNullable<RadarSignal["tone"]>, string> = {
  cyan: "text-electric",
  mint: "text-mint",
  amber: "text-ember",
  violet: "text-violet",
};

export function OpportunityRadar({
  score = 84,
  title = "Opportunity Radar",
  subtitle = "Compatibilidade entre nicho, verba, margem e risco.",
  signals = defaultSignals,
  className,
  compact = false,
}: OpportunityRadarProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const polygonPoints = useMemo(() => {
    const center = 120;
    const maxRadius = 78;
    return signals
      .map((signal, index) => {
        const angle = (Math.PI * 2 * index) / signals.length - Math.PI / 2;
        const radius = maxRadius * (Math.max(0, Math.min(100, signal.value)) / 100);
        return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
      })
      .join(" ");
  }, [signals]);

  const dots = useMemo(() => {
    const center = 120;
    const maxRadius = 78;
    return signals.map((signal, index) => {
      const angle = (Math.PI * 2 * index) / signals.length - Math.PI / 2;
      const radius = maxRadius * (Math.max(0, Math.min(100, signal.value)) / 100);
      return {
        ...signal,
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        labelX: center + Math.cos(angle) * 103,
        labelY: center + Math.sin(angle) * 103,
      };
    });
  }, [signals]);

  return (
    <article className={cn("opportunity-radar-card", compact && "opportunity-radar-card-compact", className)}>
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-electric/80">
            <Radar size={15} />
            {title}
          </div>
          {!compact && <p className="mt-2 max-w-sm text-sm leading-6 text-mist">{subtitle}</p>}
        </div>
        <span className="rounded-full border border-mint/25 bg-mint/10 px-3 py-1 font-mono text-xs font-bold text-mint">
          live
        </span>
      </div>

      <div className={cn("relative z-10 mx-auto grid place-items-center", compact ? "mt-3 h-[220px]" : "mt-6 h-[300px]")}>
        <svg viewBox="0 0 240 240" className="opportunity-radar-svg" role="img" aria-label={`Score de oportunidade ${clampedScore}`}>
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.28" />
              <stop offset="52%" stopColor="#5EF2B0" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#05070B" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="radarPolygon" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.74" />
              <stop offset="55%" stopColor="#5EF2B0" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F6B35B" stopOpacity="0.64" />
            </linearGradient>
            <filter id="radarDotGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="240" height="240" rx="20" fill="url(#radarGlow)" />
          {[36, 60, 84, 108].map((radius) => (
            <circle key={radius} cx="120" cy="120" r={radius} fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
          ))}
          {Array.from({ length: 6 }, (_, index) => {
            const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
            return (
              <line
                key={index}
                x1="120"
                y1="120"
                x2={120 + Math.cos(angle) * 108}
                y2={120 + Math.sin(angle) * 108}
                stroke="rgba(103,232,249,0.16)"
                strokeWidth="1"
              />
            );
          })}
          <polygon points={polygonPoints} fill="rgba(103,232,249,0.13)" stroke="url(#radarPolygon)" strokeWidth="2.5" />
          <circle cx="120" cy="120" r="28" fill="rgba(5,7,11,0.78)" stroke="rgba(103,232,249,0.34)" strokeWidth="1.5" />
          <text x="120" y="116" textAnchor="middle" className="radar-score-text">
            {clampedScore}
          </text>
          <text x="120" y="136" textAnchor="middle" className="radar-score-label">
            SCORE
          </text>
          {dots.map((dot) => (
            <g key={dot.label}>
              <circle cx={dot.x} cy={dot.y} r="4.5" fill="#5EF2B0" filter="url(#radarDotGlow)" />
              <text x={dot.labelX} y={dot.labelY} textAnchor="middle" dominantBaseline="middle" className="radar-axis-label">
                {dot.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {!compact && (
        <div className="relative z-10 mt-5 grid gap-2 sm:grid-cols-3">
          {signals.slice(0, 6).map((signal) => (
            <div key={signal.label} className="radar-signal-tile">
              <span className={cn("flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.08em]", toneClasses[signal.tone ?? "cyan"])}>
                <Activity size={12} />
                {signal.label}
              </span>
              <strong className="mt-1 block font-mono text-lg text-white">{Math.round(signal.value)}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="pointer-events-none absolute right-5 top-5 text-electric/20">
        <Crosshair size={72} strokeWidth={1} />
      </div>
    </article>
  );
}
