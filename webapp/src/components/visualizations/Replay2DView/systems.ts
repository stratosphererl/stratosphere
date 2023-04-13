import { useSystem, useQuery } from "@react-ecs/core";
import { Drawable, Transform, Vector3, Name, GameTime, Frame } from "./facets";
import { useCanvas } from "./hooks/useCanvas";
import * as constants from "./constants/map";
import frameData from "../mock_data/frame";
import { useTimer } from "./hooks/useTimer";
import { useState } from "react";

let frame = 0;

const interpolation_factor = 1 / 20;

let timeSinceLastFrame = 0;
let timeBetweenFrames = 1 / 30;

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

  return useTimer(
    timeBetweenFrames,
    () => {
    const dt = timeBetweenFrames;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clear();

    timeSinceLastFrame += dt;
    const interpolationPercent = Math.min(1, timeSinceLastFrame / timeBetweenFrames);

    // console.log(timeSinceLastFrame.toFixed(2), dt.toFixed(4), interpolationPercent.toFixed(2));

    query.loop([Drawable, Transform], (e, [drawable, transform]) => {
      // const drawTransform = {position: new Vector3(10000, 10000, 10000)};

      // if (transform) {
      //   drawTransform.position.x = lerp(
      //     transform.position.x,
      //     transform.nextPosition.x,
      //     interpolationPercent
      //   );
      //   drawTransform.position.y = lerp(
      //     transform.position.y,
      //     transform.nextPosition.y,
      //     interpolationPercent
      //   );
      //   drawTransform.position.z = lerp(
      //     transform.position.z,
      //     transform.nextPosition.z,
      //     interpolationPercent
      //   );
      // }

      // if (!isFinite(drawTransform.position.z))
      //   console.log(
      //     frame,
      //     drawTransform.position.x.toFixed(2),
      //     drawTransform.position.y.toFixed(2),
      //   )

      drawable.draw(ctx, transform);
    });
  });
};

export const TransformSystem = ({ data }: { data: any }) => {
  const query = useQuery((e) => e.hasAll(Transform, Name));

  // const getTillNextFrame = () => {
  //   if (frame + 1 < data.length) {
  //     const currFrame = data[frame][7];
  //     const nextFrame = data[frame + 1][7];
  //     return nextFrame["time"] - currFrame["time"];
  //   }
  //   return timeBetweenFrames;
  // }

  // const [timeTillNextFrame, setTimeTillNextFrame] = useState(getTillNextFrame());

  // const drawFunction = CanvasViewSystem();

  return useTimer(
    timeBetweenFrames,
    () => {
      timeSinceLastFrame = 0;
      frame++;
      // setTimeTillNextFrame(getTillNextFrame());
      // timeBetweenFrames = timeTillNextFrame;
      query.loop([Transform, Name], (e, [transform, name]) => {
        if (frame < data.length) {
          const game = data[frame];
          for (let i = 0; i < game.length; i++) {
            if (game[i].id === name.id) {
              transform.position.x = game[i].position.x;
              transform.position.y = game[i].position.y;
              transform.position.z = game[i].position.z;
            }
          }
          
          if (frame + 1 < data.length) {
            const gameNext = data[frame + 1];
            gameNext.forEach((entity: any) => {
              if (entity.id === name.id) {
                transform.nextPosition.x = entity.position.x;
                transform.nextPosition.y = entity.position.y;
                transform.nextPosition.z = entity.position.z;
              }
            });
          }
        }
      });

    },
  );
};

export const GameTimeSystem = ({ data }) => {
  const query = useQuery((e) => e.has(GameTime));

  return useTimer(timeBetweenFrames, () => {
    query.loop([GameTime], (e, [gameTime]) => {
      const currFrame = data[frame][7];
      gameTime.time = currFrame["seconds_remaining"];
    });
  });
};
