import { useSystem, useQuery } from "@react-ecs/core";
import { Drawable, Transform, Vector3, Name, GameTime, Frame } from "./facets";
import { useCanvas } from "./hooks/useCanvas";
import * as constants from "./constants/map";
import frameData from "../mock_data/frame";
import { useTimer } from "./hooks/useTimer";

let frame = 0;

const interpolation_factor = 0.1;

function cubicFactor(
  y0: number,
  y1: number,
  y2: number,
  y3: number,
  t: number
) {
  const a0 = y3 - y2 - y0 + y1;
  const a1 = y0 - y1 - a0;
  const a2 = y2 - y0;
  const a3 = y1;

  return a0 * t ** 3 + a1 * t ** 2 + a2 * t + a3;
}

function lerp(start: number, end: number, amt: number) {
  return start + (end - start) * amt;
}

// function lerp(start: number, end: number, amt: number) {
//   return start;
// }

export const CanvasViewSystem = () => {
  const query = useQuery((e) => e.hasAny(Drawable, Transform));
  const canvas = useCanvas();

  return useSystem((dt) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clear();

    query.loop([Drawable, Transform], (e, [drawable, transform]) => {
      if (transform) {
        transform.position.x = lerp(
          transform.position.x,
          transform.nextPosition.x,
          interpolation_factor
        );
        transform.position.y = lerp(
          transform.position.y,
          transform.nextPosition.y,
          interpolation_factor
        );
        transform.position.z = lerp(
          transform.position.z,
          transform.nextPosition.z,
          interpolation_factor
        );
      }

      drawable.draw(ctx, transform);
    });
  });
};

export const TransformSystem = ({ data }) => {
  const query = useQuery((e) => e.hasAll(Transform, Name));

  return useTimer(
    1 / 3,
    () => {
      query.loop([Transform, Name], (e, [transform, name]) => {
        if (frame < data.length) {
          const game = data[frame++];
          for (let i = 0; i < game.length; i++) {
            if (game[i].id === name.id) {
              transform.position.x = game[i].position.x;
              transform.position.y = game[i].position.y;
              transform.position.z = game[i].position.z;
            }
          }
        }
      });
    },
    () => {
      query.loop([Transform, Name], (e, [transform, name]) => {
        if (frame < data.length) {
          const gameNext = data[frame + 1];
          for (let i = 0; i < gameNext.length; i++) {
            if (gameNext[i].id === name.id) {
              transform.nextPosition.x = gameNext[i].position.x;
              transform.nextPosition.y = gameNext[i].position.y;
              transform.nextPosition.z = gameNext[i].position.z;
            }
          }
        }
      });
    }
  );
};

export const GameTimeSystem = ({ data }) => {
  const query = useQuery((e) => e.has(GameTime));

  return useTimer(1 / 3, () => {
    query.loop([GameTime], (e, [gameTime]) => {
      const currFrame = data[frame++][7];
      gameTime.time = currFrame["seconds_remaining"];
    });
  });
};
