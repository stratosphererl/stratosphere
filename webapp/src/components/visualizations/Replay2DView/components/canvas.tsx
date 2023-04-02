// @ts-nocheck
import React, { useRef, useEffect, ReactNode, useState } from "react";
import { CanvasContext } from "../context/canvasContext";

export const Canvas = ({ children }: { children: ReactNode }) => {
  const [canvasRef, setCavasRef] = useState<HTMLCanvasElement | null>(null);
  const dpi = window.devicePixelRatio;

  useEffect(() => {
    if (!canvasRef) return;

    const rect = canvasRef.getBoundingClientRect();

    canvasRef.width = rect.width * dpi;
    canvasRef.height = rect.height * dpi;

    const ctx = canvasRef.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpi, dpi);

    ctx.clear = () => {
      ctx.clearRect(0, 0, canvasRef.width / dpi, canvasRef.height / dpi);
    };
  }, [canvasRef]);

  return (
    <canvas ref={setCavasRef} style={{ width: "500px", height: "500px" }}>
      <CanvasContext.Provider value={canvasRef}>
        {children}
      </CanvasContext.Provider>
    </canvas>
  );
};
