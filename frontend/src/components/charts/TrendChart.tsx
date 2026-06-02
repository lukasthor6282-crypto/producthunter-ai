import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { month: 'Jan', trend: 54 },
  { month: 'Fev', trend: 61 },
  { month: 'Mar', trend: 64 },
  { month: 'Abr', trend: 72 },
  { month: 'Mai', trend: 83 },
  { month: 'Jun', trend: 88 },
]

export function TrendChart() {
  return (
    <div className="h-56 min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={224} initialDimension={{ width: 320, height: 224 }}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#81f3c8" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#81f3c8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9fb5c8', fontSize: 12 }} />
          <YAxis hide domain={[40, 100]} />
          <Tooltip contentStyle={{ background: '#07101b', border: '1px solid rgba(221,255,244,.14)', borderRadius: 8 }} />
          <Area type="monotone" dataKey="trend" stroke="#81f3c8" strokeWidth={3} fill="url(#trendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
