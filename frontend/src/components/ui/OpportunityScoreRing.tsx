interface OpportunityScoreRingProps {
  score: number
  size?: number
}

export function OpportunityScoreRing({ score, size = 74 }: OpportunityScoreRingProps) {
  const normalized = Math.max(0, Math.min(100, score))
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (normalized / 100) * circumference

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 72 72" className="absolute inset-0">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="7" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="7"
          transform="rotate(-90 36 36)"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="18" x2="58" y1="12" y2="58">
            <stop stopColor="#81f3c8" />
            <stop offset="1" stopColor="#ffd166" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-bold text-white">{Math.round(normalized)}</span>
    </div>
  )
}
