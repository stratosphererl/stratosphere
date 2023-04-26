import { useContext } from "react";
import { CanvasContext } from "../context/canvasContext";

export function useCanvas() {
  return useContext(CanvasContext);
}
