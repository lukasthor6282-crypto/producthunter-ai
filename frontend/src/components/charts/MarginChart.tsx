import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RecommendedProduct } from '../../types/product'

interface MarginChartProps {
  products: RecommendedProduct[]
}

export function MarginChart({ products }: MarginChartProps) {
  const data = products.slice(0, 5).map((product) => ({
    name: product.product_name.split(' ').slice(0, 2).join(' '),
    margin: Math.round(product.estimated_margin * 100),
  }))

  return (
    <div className="h-56 min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={224} initialDimension={{ width: 320, height: 224 }}>
        <BarChart data={data}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9fb5c8', fontSize: 11 }} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#07101b', border: '1px solid rgba(221,255,244,.14)', borderRadius: 8 }} />
          <Bar dataKey="margin" fill="#ffd166" radius={[6, 6, 2, 2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
