import { useSystem, useQuery, useTimer } from "@react-ecs/core";
import { Drawable, Transform, Vector3 } from "./facets";
import { useCanvas } from "./hooks/useCanvas";

export const CanvasViewSystem = () => {
  const query = useQuery((e) => e.hasAny(Drawable, Transform));
  const canvas = useCanvas();

  return useSystem((dt) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clear();

    query.loop([Drawable, Transform], (e, [drawable, transform]) => {
      drawable.draw(ctx, transform);
    });
  });
};

export const FrameByFrameSystem = (data: any) => {
  const query = useQuery((e) => e.hasAny(Transform));

  return useSystem((dt) => {
    if (!data) return;

    console.log(data);

    const positionFrame = data.data.positions.shift();
    const rotationFrame = data.data.rotations.shift();

    if (!positionFrame || !rotationFrame) return;

    query.loop([Transform], (e, [transform]) => {
      transform.position.x = positionFrame[1][0];
      transform.position.y = positionFrame[1][1];
    });
  });
};
