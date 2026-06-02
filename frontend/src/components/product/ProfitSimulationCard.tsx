import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { simulateProfit } from '../../services/recommendationApi'
import type { ProfitSimulationPayload, ProfitSimulationResult } from '../../types/recommendation'
import { GlassPanel } from '../ui/GlassPanel'
import { GlowButton } from '../ui/GlowButton'

const initialPayload: ProfitSimulationPayload = {
  selling_price: 137.9,
  product_cost: 72.4,
  marketplace_fee_percent: 0.13,
  shipping_cost: 11.8,
  packaging_cost: 2.3,
  tax_percent: 0.06,
  affiliate_commission_percent: 0,
  expected_monthly_sales: 80,
  monthly_fixed_cost: 0,
}

export function ProfitSimulationCard() {
  const [payload, setPayload] = useState(initialPayload)
  const [remoteResult, setRemoteResult] = useState<ProfitSimulationResult | null>(null)

  const localResult = useMemo(() => {
    const fee = payload.selling_price * payload.marketplace_fee_percent
    const tax = payload.selling_price * payload.tax_percent
    const commission = payload.selling_price * payload.affiliate_commission_percent
    const total = payload.product_cost + fee + payload.shipping_cost + payload.packaging_cost + tax + commission
    const profit = payload.selling_price - total
    const margin = profit / payload.selling_price
    return {
      revenue_per_unit: payload.selling_price,
      total_cost_per_unit: total,
      profit_per_unit: profit,
      net_margin: margin,
      monthly_profit_estimate: profit * payload.expected_monthly_sales - payload.monthly_fixed_cost,
      break_even_units: profit > 0 ? Math.ceil(payload.monthly_fixed_cost / profit) : 0,
      recommendation: margin > 0.28 ? 'Boa margem para testar e escalar com controle.' : 'Margem pede ajuste antes de escalar.',
    }
  }, [payload])

  const result = remoteResult ?? localResult

  async function runSimulation() {
    try {
      const response = await simulateProfit(payload)
      setRemoteResult(response)
    } catch {
      setRemoteResult(null)
    }
  }

  return (
    <GlassPanel>
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-mint/15 p-3 text-mint"><Calculator size={22} /></span>
        <div>
          <h2 className="text-xl font-bold text-white">Simulador de Lucro</h2>
          <p className="text-sm text-mist">Ajuste preco, custo, taxas e volume esperado.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(payload).map(([key, value]) => (
          <label key={key} className="block rounded-lg border border-line bg-white/[0.035] p-3 text-xs text-mist">
            {labels[key] ?? key}
            <input
              className="mt-2 w-full rounded-lg border border-line bg-ink/70 px-3 py-2 text-sm text-white outline-none focus:border-mint"
              type="number"
              step={key.includes('percent') ? '0.01' : '1'}
              value={value}
              onChange={(event) => setPayload((current) => ({ ...current, [key]: Number(event.target.value) }))}
            />
          </label>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <Result label="Lucro/un." value={`R$ ${result.profit_per_unit.toFixed(2)}`} />
        <Result label="Margem liquida" value={`${Math.round(result.net_margin * 100)}%`} />
        <Result label="Lucro mensal" value={`R$ ${result.monthly_profit_estimate.toFixed(2)}`} />
        <Result label="Equilibrio" value={`${result.break_even_units} un.`} />
      </div>
      <p className="mt-4 rounded-lg border border-line bg-white/[0.035] p-4 text-sm leading-6 text-mist">{result.recommendation}</p>
      <GlowButton onClick={runSimulation} className="mt-5">Recalcular na API</GlowButton>
    </GlassPanel>
  )
}

const labels: Record<string, string> = {
  selling_price: 'Preco de venda',
  product_cost: 'Custo',
  marketplace_fee_percent: 'Taxa marketplace',
  shipping_cost: 'Frete',
  packaging_cost: 'Embalagem',
  tax_percent: 'Imposto',
  affiliate_commission_percent: 'Comissao',
  expected_monthly_sales: 'Vendas mensais',
  monthly_fixed_cost: 'Custo fixo mensal',
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.04] p-3">
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  )
}
