import { BrainCircuit, Target, WandSparkles } from "lucide-react";
import type { ReactNode } from "react";

import { GlassCard } from "../ui/GlassCard";
import { StatusChip } from "../ui/StatusChip";
import type { RecommendationItem } from "../../types/recommendation";

type AIExplanationPanelProps = {
  item?: RecommendationItem;
};

export function AIExplanationPanel({ item }: AIExplanationPanelProps) {
  if (!item) {
    return (
      <GlassCard className="p-5">
        <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
          <p className="text-sm text-mist">Gere um ranking para ver a explicação da IA.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-5" variant="electric" interactive>
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-md border border-electric/20 bg-electric/10 p-3 text-electric shadow-[0_0_30px_rgba(98,230,255,0.16)]">
          <BrainCircuit size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="section-label">raciocínio da IA</p>
          <h3 className="mt-1 text-xl font-extrabold text-white">Explicação da IA</h3>
          <p className="text-sm text-mist">{item.product.name}</p>
        </div>
        <StatusChip tone="mint">{item.opportunity_score.toFixed(0)}/100</StatusChip>
      </div>
      <div className="space-y-4">
        <Insight icon={<WandSparkles size={18} />} title="Motivo" text={item.explanation} />
        <Insight icon={<Target size={18} />} title="Público-alvo" text={item.target_audience} />
        <Insight icon={<BrainCircuit size={18} />} title="Estratégia" text={item.recommended_strategy} />
      </div>
    </GlassCard>
  );
}

function Insight({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="metric-panel p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-white">
        <span className="text-mint">{icon}</span>
        {title}
      </div>
      <p className="text-sm leading-6 text-mist">{text}</p>
    </div>
  );
}
