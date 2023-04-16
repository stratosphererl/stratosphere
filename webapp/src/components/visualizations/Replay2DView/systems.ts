import { useSystem, useQuery } from "@react-ecs/core";
import { Drawable, Transform, Vector3, Name, GameTime, Frame } from "./facets";
import { useCanvas } from "./hooks/useCanvas";
import * as constants from "./constants/map";
import frameData from "../mock_data/frame";
import { useTimer } from "./hooks/useTimer";
import { useState } from "react";

let frame = 0;

let timeSinceLastFrame = 0;
let timeBetweenFrames = 1 / 30;

function lerp(start: number, end: number, amt: number) {
  return start + (end - start) * amt;
}

export const CanvasViewSystem = () => {
  const query = useQuery((e) => e.hasAny(Drawable, Transform));
  const canvas = useCanvas();

  return useTimer(timeBetweenFrames, () => {
    const dt = timeBetweenFrames;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clear();

    timeSinceLastFrame += dt;
    const interpolationPercent = Math.min(
      1,
      timeSinceLastFrame / timeBetweenFrames
    );

    query.loop([Drawable, Transform], (e, [drawable, transform]) => {
      drawable.draw(ctx, transform);
    });
  });
};

export const TransformSystem = ({ data }: { data: any }) => {
  const query = useQuery((e) => e.hasAll(Transform, Name));

  return useTimer(timeBetweenFrames, () => {
    timeSinceLastFrame = 0;
    frame++;
    query.loop([Transform, Name], (e, [transform, name]) => {
      if (frame < data.length) {
        const game = data[frame];
        for (let i = 0; i < game.length; i++) {
          if (game[i].id === name.id) {
            transform.position.x = game[i].position.x;
            transform.position.y = game[i].position.y;
            transform.position.z = game[i].position.z;
            if (game[i]?.rotation?.y !== undefined)
              transform.rotation.y = game[i].rotation.y;
            else transform.rotation.y = 0;
          }
        }
      }
    });
  });
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
