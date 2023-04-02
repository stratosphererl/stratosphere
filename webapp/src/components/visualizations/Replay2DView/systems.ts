import { useSystem, useQuery } from "@react-ecs/core";
import { Drawable, Transform } from "./facets";
import { useCanvas } from "./hooks/useCanvas";

export const CanvasViewSystem = () => {
  const query = useQuery((e) => e.hasAll(Drawable, Transform));
  const canvas = useCanvas();

  return useSystem((dt) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clear();

    query.loop([Drawable, Transform], (e, [drawable, transform]) => {
      const { position } = transform;
      drawable.draw(ctx, transform);
    });
  });
};
