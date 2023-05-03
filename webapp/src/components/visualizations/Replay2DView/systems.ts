import { useSystem, useQuery, useTimer } from "@react-ecs/core";
import { Drawable, Transform, Vector3, Name } from "./facets";
import { useCanvas } from "./hooks/useCanvas";
import * as constants from "./constants/map";
import frameData from "../mock_data/frame";

let frame = 0;

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

export const TransformSystem = ({ data, onUpdate }) => {
  const query = useQuery((e) => e.hasAll(Transform, Name));

  return useSystem((dt) => {
    const game = data[frame++];
    onUpdate(frame);
    query.loop([Transform, Name], (e, [transform, name]) => {
      for (const actor of game) {
        if (actor.id === name.name) {
          transform.position.x = actor.position.x;
          transform.position.y = actor.position.y;
        }
      }
    });
  });
};
