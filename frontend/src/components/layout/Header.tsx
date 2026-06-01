import { Activity, Command, Sparkles, Zap } from "lucide-react";
import type { ComponentType } from "react";

import { GlowButton } from "../ui/GlowButton";
import { StatusChip } from "../ui/StatusChip";

type HeaderProps = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ComponentType<{ size?: number; className?: string }>;
  tone?: "electric" | "mint" | "ember" | "violet";
};

const toneClasses: Record<NonNullable<HeaderProps["tone"]>, string> = {
  electric: "border-electric/25 bg-electric/10 text-electric",
  mint: "border-mint/25 bg-mint/10 text-mint",
  ember: "border-ember/25 bg-ember/10 text-ember",
  violet: "border-violet/25 bg-violet/10 text-violet-200",
};

export function Header({ title, subtitle, actionLabel, onAction, icon: Icon = Sparkles, tone = "electric" }: HeaderProps) {
  return (
    <header className="glass-surface glass-strong mb-6 rounded-lg px-4 py-4 md:px-5">
      <div className="glass-content flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border ${toneClasses[tone]}`}>
            <Icon size={21} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">{title}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-mist">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <StatusChip tone="mint" icon={<Activity size={14} />}>
            API pronta
          </StatusChip>
          <StatusChip tone="ember" icon={<Zap size={14} />}>
            ML inicial
          </StatusChip>
          {actionLabel && (
            <GlowButton onClick={onAction} className="min-h-8 px-3 py-1.5">
              <Command size={15} />
              {actionLabel}
            </GlowButton>
          )}
        </div>
      </div>
    </header>
  );
}
