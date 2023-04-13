import { useSystem } from "@react-ecs/core";
import { useRef } from "react";

export const useTimer = (
  interval: number,
  fixedCallback: () => void,
  variableCallback?: () => void
) => {
  const time = useRef(0);
  return useSystem((dt) => {
    time.current += dt;
    if (variableCallback) variableCallback();
    if (time.current > interval) {
      time.current = 0;
      fixedCallback();
    }
  });
};
