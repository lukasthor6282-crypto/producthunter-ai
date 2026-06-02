import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { step: 'Busca', value: 100 },
  { step: 'Clique', value: 42 },
  { step: 'Carrinho', value: 24 },
  { step: 'Venda', value: 18 },
]

export function ConversionChart() {
  return (
    <div className="h-48 min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={192} initialDimension={{ width: 320, height: 192 }}>
        <LineChart data={data}>
          <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fill: '#9fb5c8', fontSize: 12 }} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip contentStyle={{ background: '#07101b', border: '1px solid rgba(221,255,244,.14)', borderRadius: 8 }} />
          <Line type="monotone" dataKey="value" stroke="#60d8ff" strokeWidth={3} dot={{ fill: '#60d8ff', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
