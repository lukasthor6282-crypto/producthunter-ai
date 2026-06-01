import { Boxes } from "lucide-react";

import { Header } from "../components/layout/Header";
import { ProductDetailPanel } from "../components/product/ProductDetailPanel";
import { GlassCard } from "../components/ui/GlassCard";
import type { RecommendationItem } from "../types/recommendation";

type ProductDetailProps = {
  item?: RecommendationItem;
};

export function ProductDetail({ item }: ProductDetailProps) {
  return (
    <div className="py-6 md:py-8">
      <Header
        title="Análise de produto"
        subtitle="Leitura simples do produto selecionado no ranking, com métricas comerciais, operacionais e explicação da IA."
        icon={Boxes}
        tone="electric"
      />
      {!item ? (
        <GlassCard className="p-6 text-mist">Selecione um produto no ranking para ver a análise.</GlassCard>
      ) : (
        <ProductDetailPanel item={item} />
      )}
    </div>
  );
}
