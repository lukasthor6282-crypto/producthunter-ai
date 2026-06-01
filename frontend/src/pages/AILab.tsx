import { useMutation, useQuery } from "@tanstack/react-query";
import { FlaskConical } from "lucide-react";

import { AILabPanel } from "../components/ml/AILabPanel";
import { explainML, predictML } from "../services/recommendationApi";
import type { RecommendationItem } from "../types/recommendation";
import { defaultProfile } from "../types/userProfile";

type AILabProps = {
  item?: RecommendationItem;
};

export function AILab({ item }: AILabProps) {
  const explanationQuery = useQuery({
    queryKey: ["ml", "explain"],
    queryFn: explainML,
  });
  const predictionMutation = useMutation({
    mutationFn: () => predictML(defaultProfile, item?.product.id),
  });

  return (
    <div className="min-h-screen">
      <header className="kombai-topbar -mx-4 flex items-center justify-between gap-4 px-4 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-violet/35 bg-violet/15 text-violet-200">
            <FlaskConical size={21} />
          </span>
          <div>
            <h1 className="text-2xl font-black text-white">Laboratório de IA</h1>
            <p className="mt-1 text-sm text-slate-500">Entenda como o ProductHunter calcula scores e recomendações.</p>
          </div>
        </div>
        <div className="hidden flex-wrap gap-3 md:flex">
          <span className="kombai-chip kombai-chip-green">Modelo v2.3.1 ativo</span>
          <span className="kombai-chip">Última atualização: Hoje</span>
        </div>
      </header>

      <div className="py-7">
        <AILabPanel
          explanation={explanationQuery.data ?? null}
          prediction={predictionMutation.data ?? null}
          isLoading={predictionMutation.isPending}
          onRun={() => void predictionMutation.mutate()}
        />
      </div>
    </div>
  );
}
