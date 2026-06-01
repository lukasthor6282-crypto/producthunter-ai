import { Calculator } from "lucide-react";

import { ProfitSimulationCard } from "../components/dashboard/ProfitSimulationCard";
import type { RecommendationItem } from "../types/recommendation";

type ProfitSimulatorProps = {
  item?: RecommendationItem;
};

export function ProfitSimulator({ item }: ProfitSimulatorProps) {
  return (
    <div className="min-h-screen">
      <header className="kombai-topbar -mx-4 flex items-center justify-between gap-4 px-4 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
            <Calculator size={20} />
          </span>
          <div>
            <h1 className="text-xl font-black leading-tight text-white">Simulador de Lucro</h1>
            <p className="mt-1 text-sm text-slate-500">Calcule sua margem real antes de apostar seu estoque</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="kombai-chip kombai-chip-green">{item?.product.name ?? "Mini Impressora Termica"}</span>
        </div>
      </header>

      <div className="py-7">
        <ProfitSimulationCard item={item} />
      </div>
    </div>
  );
}
