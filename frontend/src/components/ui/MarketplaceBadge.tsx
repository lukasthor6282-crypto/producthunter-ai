interface MarketplaceBadgeProps {
  marketplace: string
}

const badgeStyles: Record<string, string> = {
  Shopee: 'border-orange-300/30 bg-orange-400/10 text-orange-100',
  Amazon: 'border-amber/30 bg-amber/10 text-amber',
  'Mercado Livre': 'border-yellow-200/30 bg-yellow-300/10 text-yellow-100',
  AliExpress: 'border-red-300/30 bg-red-400/10 text-red-100',
  'TikTok Shop': 'border-cyan/30 bg-cyan/10 text-cyan',
  Magalu: 'border-blue-300/30 bg-blue-400/10 text-blue-100',
  Shein: 'border-white/25 bg-white/10 text-white',
}

export function MarketplaceBadge({ marketplace }: MarketplaceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${badgeStyles[marketplace] ?? 'border-line bg-white/10 text-white'}`}
    >
      {marketplace}
    </span>
  )
}
