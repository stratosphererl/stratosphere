import { useSystem, useQuery, useTimer } from "@react-ecs/core";
import { Drawable, Transform, Vector3, Name, GameTime, Frame } from "./facets";
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

export const TransformSystem = ({ data }) => {
  const query = useQuery((e) => e.hasAll(Transform, Name));

  return useSystem((dt) => {
    query.loop([Transform, Name], (e, [transform, name]) => {
      if (frame < data.length) {
        const game = data[frame++];

        for (const actor of game) {
          if (actor.id === name.id) {
            transform.position.x = actor.position.x;
            transform.position.y = actor.position.y;
            transform.position.z = actor.position.z;
          }
        }
      }
    });
  });
};

export const GameTimeSystem = ({ data }) => {
  const query = useQuery((e) => e.has(GameTime));

  return useSystem((dt) => {
    query.loop([GameTime], (e, [gameTime]) => {
      const currFrame = data[frame++][7];
      gameTime.time = currFrame["seconds_remaining"];
    });
  });
};
