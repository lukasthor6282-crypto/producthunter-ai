import { Check, Copy, ExternalLink, Image, Package, Star, Truck } from "lucide-react";
import { useState } from "react";

import { ConversionChart } from "../charts/ConversionChart";
import { MarginChart } from "../charts/MarginChart";
import { OpportunityScoreRing } from "../dashboard/OpportunityScoreRing";
import { AIExplanationPanel } from "../recommendation/AIExplanationPanel";
import { GlassCard } from "../ui/GlassCard";
import { MarketplaceBadge } from "./MarketplaceBadge";
import { ProductImage } from "./ProductImage";
import { RiskIndicator } from "./RiskIndicator";
import { isUsableProductImageUrl } from "../../lib/productImages";
import { brl, compactNumber, percent } from "../../services/format";
import type { RecommendationItem } from "../../types/recommendation";

type ProductDetailPanelProps = {
  item: RecommendationItem;
};

export function ProductDetailPanel({ item }: ProductDetailPanelProps) {
  const [copiedImageUrl, setCopiedImageUrl] = useState(false);
  const usableImageUrl = isUsableProductImageUrl(item.product.image_url) ? item.product.image_url : null;
  const isRealMarketplaceProduct = ["google_shopping", "mercado_livre"].includes(item.product.source);
  const marginData = [
    { name: "Preço", margin: item.product.average_price },
    { name: "Custo", margin: item.product.estimated_cost },
    { name: "Lucro", margin: item.estimated_profit },
  ];
  const conversionData = [
    { name: "Tendência", conversion: item.product.trend_score },
    { name: "Apelo", conversion: item.product.visual_appeal },
    { name: "Conversão", conversion: item.conversion_probability },
    { name: "Giro", conversion: item.product.sales_velocity },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassCard className="p-4 md:p-6" variant="strong" interactive>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
              <ProductImage product={item.product} className="h-32 w-full sm:h-36 sm:w-36" iconSize={34} />
              <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <MarketplaceBadge marketplace={item.product.marketplace} label={item.product.marketplace_label} />
                <span className="rounded-md border border-white/10 bg-white/[0.055] px-2.5 py-1 text-xs font-bold text-mist">
                  {item.product.niche_label}
                </span>
                {isRealMarketplaceProduct && (
                  <span className="rounded-md border border-mint/20 bg-mint/10 px-2.5 py-1 text-xs font-bold text-mint">
                    Produto real
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">{item.product.name}</h2>
              <p className="mt-4 text-sm leading-7 text-mist">{item.explanation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.product.product_url && (
                  <a
                    href={item.product.product_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 text-sm font-black text-cyan-200 transition hover:border-cyan-300/45 hover:bg-cyan-300/15"
                  >
                    Ver fonte do produto
                    <ExternalLink size={15} />
                  </a>
                )}
                {usableImageUrl && (
                  <>
                    <a
                      href={usableImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-mint/25 bg-mint/10 px-3 text-sm font-black text-mint transition hover:border-mint/45 hover:bg-mint/15"
                    >
                      Abrir imagem
                      <Image size={15} />
                    </a>
                    <button
                      type="button"
                      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.055] px-3 text-sm font-black text-mist transition hover:border-white/20 hover:bg-white/[0.08]"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(usableImageUrl);
                          setCopiedImageUrl(true);
                          window.setTimeout(() => setCopiedImageUrl(false), 1600);
                        } catch {
                          setCopiedImageUrl(false);
                        }
                      }}
                    >
                      {copiedImageUrl ? <Check size={15} /> : <Copy size={15} />}
                      {copiedImageUrl ? "Copiado" : "Copiar imagem"}
                    </button>
                  </>
                )}
              </div>
              </div>
            </div>
            <OpportunityScoreRing score={item.opportunity_score} size="lg" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label="Preço médio" value={brl.format(item.product.average_price)} />
            <Metric label="Custo" value={brl.format(item.product.estimated_cost)} />
            <Metric label="Margem" value={percent(item.estimated_margin_percent)} tone="text-mint" />
            <Metric label="Lucro" value={brl.format(item.estimated_profit)} tone="text-ember" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 md:p-6" variant="electric" interactive>
          <h3 className="text-xl font-extrabold text-white">Indicadores operacionais</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Detail icon={<Package size={18} />} label="Categoria" value={item.product.category} />
            <Detail icon={<Truck size={18} />} label="Prazo" value={`${item.product.delivery_days} dias`} />
            <Detail icon={<Star size={18} />} label="Reviews" value={compactNumber(item.product.reviews_count)} />
            <Detail icon={<Star size={18} />} label="Avaliação" value={item.product.average_rating.toFixed(2)} />
          </div>
          <div className="mt-5 border-t border-white/10 pt-5">
            <RiskIndicator value={item.risk_score} />
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_410px]">
        <GlassCard className="p-4 md:p-5" variant="mint" interactive>
          <p className="section-label">margem</p>
          <h3 className="mt-1 text-xl font-extrabold text-white">Economia unitária</h3>
          <MarginChart data={marginData} />
        </GlassCard>
        <GlassCard className="p-4 md:p-5" variant="electric" interactive>
          <p className="section-label">conversão</p>
          <h3 className="mt-1 text-xl font-extrabold text-white">Sinais de venda</h3>
          <ConversionChart data={conversionData} />
        </GlassCard>
        <AIExplanationPanel item={item} />
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="metric-panel p-3 md:p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-mist">{label}</p>
      <p className={`mono-number mt-2 text-lg font-extrabold ${tone}`}>{value}</p>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric-panel p-3 md:p-4">
      <div className="mb-3 inline-flex rounded-md bg-white/[0.06] p-2 text-electric">{icon}</div>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-mist">{label}</p>
      <p className="mt-2 text-base font-extrabold text-white">{value}</p>
    </div>
  );
}
