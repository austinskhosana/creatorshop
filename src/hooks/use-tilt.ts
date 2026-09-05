"use client";

import { useCallback, useState } from "react";

export function useTilt(maxDeg = 15) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setRotateY(x * maxDeg);
      setRotateX(-y * maxDeg);
    },
    [maxDeg]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}
