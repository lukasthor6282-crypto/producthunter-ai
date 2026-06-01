import type { PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

type BentoGridProps = PropsWithChildren<{
  className?: string;
}>;

export function BentoGrid({ children, className }: BentoGridProps) {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
}
