import { useCallback, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

export function useMouseTilt(maxTilt = 8) {
  const [style, setStyle] = useState<CSSProperties>({});

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * maxTilt;
      const rotateX = ((0.5 - y / rect.height) * maxTilt);
      setStyle({
        transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`,
      });
    },
    [maxTilt],
  );

  const onMouseLeave = useCallback(() => {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
  }, []);

  return { style, onMouseMove, onMouseLeave };
}
