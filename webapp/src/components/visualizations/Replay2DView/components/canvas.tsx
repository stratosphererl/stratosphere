// @ts-nocheck
import { useEffect, ReactNode, useState } from "react";
import { CanvasContext } from "../context/canvasContext";
import * as constants from "../constants/map";

export const Canvas = ({ children }: { children: ReactNode }) => {
  const [canvasRef, setCavasRef] = useState<HTMLCanvasElement | null>(null);
  const dpi = devicePixelRatio;

  useEffect(() => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext("2d");
    if (!ctx) return;

    const rect = canvasRef.getBoundingClientRect();

    canvasRef.width = rect.width * dpi;
    canvasRef.height = rect.height * dpi;

    // make sure the canvas is scaled correctly to the device
    ctx.scale(dpi, dpi);

    // move the origin to the center of the canvas
    ctx.translate(canvasRef.width / (2 * dpi), canvasRef.height / (2 * dpi));

    // important values for scaling drawings correctly
    ctx.scales = {
      xScale:
        canvasRef.width /
        devicePixelRatio /
        (constants.MAP_LIMS.x.min - constants.MAP_LIMS.x.max),
      yScale:
        canvasRef.height /
        devicePixelRatio /
        (constants.MAP_LIMS.y.min - constants.MAP_LIMS.y.max),
    };

    ctx.clear = () => {
      // clears the canvas given origin is at the center
      ctx.clearRect(
        -canvasRef.width / (2 * dpi),
        -canvasRef.height / (2 * dpi),
        canvasRef.width,
        canvasRef.height
      );
    };
  }, [canvasRef]);

  return (
    <canvas
      className="mx-auto"
      ref={setCavasRef}
      style={{ width: "500px", height: "500px" }}
    >
      <CanvasContext.Provider value={canvasRef}>
        {children}
      </CanvasContext.Provider>
    </canvas>
  );
};
