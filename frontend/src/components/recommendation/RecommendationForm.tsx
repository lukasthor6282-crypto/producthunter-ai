import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowLeftRight,
  Banknote,
  Building2,
  CircleDollarSign,
  Crown,
  Factory,
  MousePointer2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import { AIAnalysisLoader } from "../ml/AIAnalysisLoader";
import type { UserProfile } from "../../types/userProfile";
import { defaultProfile, profileOptions } from "../../types/userProfile";
import { cn } from "../../lib/utils";

const profileSchema = z.object({
  operation_type: z.string().min(1, "Informe seu tipo de operação."),
  marketplace: z.string().min(1, "Escolha o marketplace."),
  niche: z.string().min(1, "Escolha o nicho."),
  goal: z.string().min(1, "Escolha o objetivo."),
  investment_range: z.string().min(1, "Escolha a faixa de investimento."),
  experience_level: z.string().min(1, "Escolha seu nível de experiência."),
  traffic_type: z.string().min(1, "Escolha o tipo de tráfego."),
});

type RecommendationFormProps = {
  onSubmit: (profile: UserProfile) => Promise<void> | void;
  isLoading?: boolean;
};

const operationIcons: Record<string, ReactNode> = {
  seller: <Store size={18} />,
  affiliate: <Users size={18} />,
  dropshipping: <Truck size={18} />,
  reseller: <ArrowLeftRight size={18} />,
  own_store: <Building2 size={18} />,
};

const goalIcons: Record<string, ReactNode> = {
  margin_and_conversion: <CircleDollarSign size={18} />,
  highest_profit: <CircleDollarSign size={18} />,
  fast_turnover: <Rocket size={18} />,
  low_competition: <ShieldCheck size={18} />,
  high_conversion: <MousePointer2 size={18} />,
  viral_product: <Zap size={18} />,
  high_ticket: <Banknote size={18} />,
  high_commission: <CircleDollarSign size={18} />,
  beginner_product: <Crown size={18} />,
  low_risk: <ShieldCheck size={18} />,
};

const marketplaceMarks: Record<string, string> = {
  mercado_livre: "ML",
  amazon: "a",
  shopee: "S",
  aliexpress: "AE",
  tiktok_shop: "TT",
  magalu: "MG",
  shein: "SH",
};

const marketplaceTones: Record<string, string> = {
  mercado_livre: "bg-yellow-300 text-black",
  amazon: "bg-orange-400 text-white",
  shopee: "bg-orange-500 text-white",
  aliexpress: "bg-rose-500 text-white",
  tiktok_shop: "bg-black text-white",
  magalu: "bg-blue-500 text-white",
  shein: "bg-neutral-900 text-white",
};

const displayGoal: Record<string, string> = {
  margin_and_conversion: "Maior Lucro",
  highest_profit: "Maior Lucro",
  fast_turnover: "Giro Rápido",
  low_competition: "Baixa Concorrência",
  high_conversion: "Alta Conversão",
  viral_product: "Produto Viral",
  high_ticket: "Ticket Alto",
  high_commission: "Comissão Alta",
  beginner_product: "Produto Iniciante",
  low_risk: "Baixo Risco",
};

const investmentLabels: Record<string, string> = {
  up_to_500: "R$500",
  "500_to_2000": "R$500-2K",
  "2000_to_5000": "R$2K-5K",
  "5000_plus": "+R$5K",
};

const goalOrder = [
  "margin_and_conversion",
  "fast_turnover",
  "low_competition",
  "high_conversion",
  "viral_product",
  "high_ticket",
  "high_commission",
  "low_risk",
];

const formDefaultProfile: UserProfile = {
  ...defaultProfile,
  experience_level: "intermediate",
};

export function RecommendationForm({ onSubmit, isLoading = false }: RecommendationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: formDefaultProfile,
  });

  const selected = watch();

  const setField = (field: keyof UserProfile, value: string) => {
    setValue(field, value, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <form className="kombai-card overflow-hidden" onSubmit={handleSubmit((values) => void onSubmit(values))}>
      {(Object.keys(formDefaultProfile) as Array<keyof UserProfile>).map((field) => (
        <input key={field} type="hidden" {...register(field)} />
      ))}

      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/8" />
          <span className="ml-2 truncate text-xs font-black text-slate-600 sm:text-sm md:ml-3">consulta.perfil — ProductHunter</span>
        </div>
        <span className="hidden text-xs font-semibold text-slate-600 md:inline">Estimativa: 30 segundos</span>
      </div>

      <div className="space-y-7 p-4 md:space-y-10 md:p-10">
        <FormSection index="01" title="Eu sou" required error={errors.operation_type?.message}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {profileOptions.operation_type.map((option) => (
              <ChoiceButton
                key={option.value}
                active={selected.operation_type === option.value}
                onClick={() => setField("operation_type", option.value)}
                icon={operationIcons[option.value]}
              >
                {option.label}
              </ChoiceButton>
            ))}
          </div>
        </FormSection>

        <FormSection index="02" title="Quero atuar em" error={errors.marketplace?.message}>
          <div className="flex flex-wrap gap-3">
            {profileOptions.marketplace.map((option) => (
              <ChoiceButton
                key={option.value}
                active={selected.marketplace === option.value}
                onClick={() => setField("marketplace", option.value)}
                compact
                icon={
                  <span className={cn("flex h-5 min-w-5 items-center justify-center rounded text-[10px] font-black", marketplaceTones[option.value])}>
                    {marketplaceMarks[option.value]}
                  </span>
                }
              >
                {option.label}
              </ChoiceButton>
            ))}
          </div>
        </FormSection>

        <FormSection index="03" title="Nicho" error={errors.niche?.message}>
          <div className="flex flex-wrap gap-2">
            {profileOptions.niche.map((option) => (
              <PillButton key={option.value} active={selected.niche === option.value} onClick={() => setField("niche", option.value)}>
                {option.label}
              </PillButton>
            ))}
          </div>
        </FormSection>

        <div className="grid gap-10 xl:grid-cols-[1fr_0.96fr]">
          <FormSection index="04" title="Meu objetivo" error={errors.goal?.message}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
              {goalOrder.map((value) => profileOptions.goal.find((option) => option.value === value)).filter(Boolean).map((option) => (
                <ChoiceButton
                  key={option!.value}
                  active={selected.goal === option!.value}
                  onClick={() => setField("goal", option!.value)}
                  icon={goalIcons[option!.value]}
                  tall
                >
                  {displayGoal[option!.value] ?? option!.label}
                </ChoiceButton>
              ))}
            </div>
          </FormSection>

          <div className="space-y-8">
            <FormSection index="05" title="Nível de experiência" error={errors.experience_level?.message}>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {profileOptions.experience_level.map((option) => (
                  <ChoiceButton
                    key={option.value}
                    active={selected.experience_level === option.value}
                    onClick={() => setField("experience_level", option.value)}
                    compact
                    icon={option.value === "intermediate" ? <TrendingGlyph /> : option.value === "advanced" ? <Crown size={16} /> : undefined}
                  >
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
            </FormSection>

            <FormSection index="06" title="Tipo de tráfego" error={errors.traffic_type?.message}>
              <div className="flex flex-wrap gap-2">
                {profileOptions.traffic_type.map((option) => (
                  <PillButton key={option.value} active={selected.traffic_type === option.value} onClick={() => setField("traffic_type", option.value)}>
                    {option.label.replace("Tráfego pago", "Pago").replace("Influenciador", "Indefinido")}
                  </PillButton>
                ))}
              </div>
            </FormSection>

            <FormSection index="07" title="Investimento disponível" error={errors.investment_range?.message}>
              <div className="pt-2">
                <div className="relative h-8">
                  <div className="absolute left-0 right-0 top-3 h-1 rounded-full bg-white/10" />
                  <div
                    className="absolute left-0 top-3 h-1 rounded-full bg-[linear-gradient(90deg,#62e6ff,#65f0b7)]"
                    style={{ width: `${investmentProgress(selected.investment_range)}%` }}
                  />
                  <div className="relative grid grid-cols-4">
                    {profileOptions.investment_range.map((option) => {
                      const active = selected.investment_range === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className="flex flex-col items-center gap-3 text-xs font-black"
                          onClick={() => setField("investment_range", option.value)}
                        >
                          <span className={cn("h-4 w-4 rounded-full border-2 border-[#07090d]", active ? "bg-cyan-300 shadow-[0_0_18px_rgba(98,230,255,0.8)]" : "bg-white/12")} />
                          <span className={active ? "text-cyan-200" : "text-slate-600"}>{investmentLabels[option.value] ?? option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </FormSection>
          </div>
        </div>

        <motion.div layout>
          {isLoading ? (
            <AIAnalysisLoader />
          ) : (
            <button type="submit" className="kombai-btn kombai-btn-solid min-h-14 w-full text-base">
              <Sparkles size={18} />
              Encontrar Produtos
            </button>
          )}
        </motion.div>

        <p className="text-center text-xs font-semibold text-slate-600">
          Dados usados apenas para gerar recomendações. Nunca compartilhados.
        </p>
      </div>
    </form>
  );
}

function FormSection({ index, title, required = false, error, children }: { index: string; title: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <section className="border-b border-white/10 pb-7 last:border-b-0 md:pb-9">
      <div className="mb-4 flex flex-wrap items-center gap-3 md:mb-5 md:gap-4">
        <span className="font-mono text-xs font-black text-slate-600">{index}</span>
        <h2 className="font-black text-white">{title}</h2>
        {required && <span className="text-xs font-black text-rose-400">obrigatório</span>}
        {error && <span className="text-xs font-black text-rose-300">{error}</span>}
      </div>
      {children}
    </section>
  );
}

function ChoiceButton({ active, onClick, icon, children, compact = false, tall = false }: { active: boolean; onClick: () => void; icon?: ReactNode; children: ReactNode; compact?: boolean; tall?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-3 text-center text-sm font-black transition duration-200 md:gap-3 md:px-4",
        tall && "min-h-[64px] justify-start p-3 text-left md:min-h-[74px] md:p-4",
        compact && "min-h-10",
        active
          ? "border-cyan-300/55 bg-cyan-300/[0.11] text-cyan-200 shadow-[0_0_30px_rgba(98,230,255,0.12)]"
          : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/18 hover:bg-white/[0.07] hover:text-white",
      )}
    >
      {icon && <span className={active ? "text-cyan-200" : "text-slate-500"}>{icon}</span>}
      {children}
    </button>
  );
}

function PillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full border px-4 text-sm font-bold transition",
        active
          ? "border-cyan-300/52 bg-cyan-300/[0.11] text-cyan-200"
          : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/18 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function TrendingGlyph() {
  return (
    <span className="relative inline-flex h-4 w-4 items-center justify-center text-cyan-200">
      <Factory size={16} />
    </span>
  );
}

function investmentProgress(value: string) {
  const index = profileOptions.investment_range.findIndex((option) => option.value === value);
  if (index <= 0) return 0;
  return (index / Math.max(1, profileOptions.investment_range.length - 1)) * 100;
}
