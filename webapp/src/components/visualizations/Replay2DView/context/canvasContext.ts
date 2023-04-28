import { createContext } from "react";

export const CanvasContext = createContext<
  CanvasRenderingContext2D | undefined
>(undefined);
