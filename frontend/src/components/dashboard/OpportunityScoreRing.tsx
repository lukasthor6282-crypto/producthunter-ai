import { useId } from "react";

type OpportunityScoreRingProps = {
  score: number;
  size?: "xs" | "sm" | "lg";
};

export function OpportunityScoreRing({ score, size = "lg" }: OpportunityScoreRingProps) {
  const id = useId();
  const dimension = size === "lg" ? 128 : size === "sm" ? 84 : 58;
  const stroke = size === "lg" ? 10 : size === "sm" ? 8 : 6;
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(score, 100)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: dimension, height: dimension }}>
      <svg width={dimension} height={dimension} className="-rotate-90">
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#65f0b7" />
            <stop offset="58%" stopColor="#62e6ff" />
            <stop offset="100%" stopColor="#f8b85c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className={`mono-number ${size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-sm"} font-bold text-white`}>{score.toFixed(0)}</div>
        {size !== "xs" && <div className="text-[10px] font-medium uppercase text-mist">score</div>}
      </div>
    </div>
  );
}
