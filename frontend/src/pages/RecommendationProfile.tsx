import { Clock, DatabaseZap } from "lucide-react";

import { RecommendationForm } from "../components/recommendation/RecommendationForm";
import type { UserProfile } from "../types/userProfile";

type RecommendationProfileProps = {
  onGenerate: (profile: UserProfile) => Promise<void>;
  isLoading: boolean;
};

export function RecommendationProfile({ onGenerate, isLoading }: RecommendationProfileProps) {
  return (
    <div className="min-h-screen py-10">
      <div className="mb-10 flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div>
          <span className="kombai-chip kombai-chip-cyan">
            <DatabaseZap size={14} />
            IA em tempo real
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-5xl">Simule seu Cenario</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Informe seu perfil e receba um ranking personalizado de oportunidades baseado em dados de mercado.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="kombai-chip kombai-chip-green">Dados atualizados</span>
          <span className="kombai-chip">
            <Clock size={14} />
            Historico
          </span>
        </div>
      </div>

      <RecommendationForm onSubmit={onGenerate} isLoading={isLoading} />
    </div>
  );
}
