import type { PropsWithChildren } from "react";
import { useMouseTilt } from "../../hooks/useMouseTilt";
import { cn } from "../../lib/utils";

type TiltCard3DProps = PropsWithChildren<{
  className?: string;
}>;

export function TiltCard3D({ children, className = "" }: TiltCard3DProps) {
  const tilt = useMouseTilt(7);
  return (
    <div
      className={cn("min-w-0 transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d]", className)}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      {children}
    </div>
  );
}
