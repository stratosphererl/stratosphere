// @ts-nocheck
import { useEffect, ReactNode, useState } from "react";
import { CanvasContext } from "../context/canvasContext";
import * as constants from "../constants/map";

export const Canvas = ({ children }: { children: ReactNode }) => {
  const [canvasRef, setCavasRef] = useState<HTMLCanvasElement | null>(null);
  const dpi = devicePixelRatio;

  useEffect(() => {
    if (!canvasRef) return;
    const ctx = canvasRef?.getContext("2d");
    if (!ctx) return;

    const rect = canvasRef.getBoundingClientRect();

    // canvasRef.width = rect.width * dpi;
    // canvasRef.height = rect.height * dpi;

    // make sure the canvas is scaled correctly to the device
    // ctx.scale(dpi, dpi);

    // move the origin to the center of the canvas
    ctx.translate(canvasRef.width / 2, canvasRef.height / 2);

    // important values for scaling drawings correctly
    ctx.scales = {
      xScale:
        1,
      yScale:
        1,
    };

    ctx.clear = () => {
      // clears the canvas given origin is at the center
      ctx.clearRect(
        -canvasRef.width / (2),
        -canvasRef.height / (2),
        canvasRef.width,
        canvasRef.height
      );
    };
  }, [canvasRef]);

  return (
    <svg width="50%" viewBox="-4096 -6000 8192 12000">
      <foreignObject width="100%" height="100%">
        <body>
          <canvas
            className="mx-auto"
            ref={setCavasRef}
            width="819.2px"
            height="1200px"
            >
            <CanvasContext.Provider value={canvasRef}>
              {children}
            </CanvasContext.Provider>
          </canvas>
        </body>
      </foreignObject>
    </svg>
  );
};
