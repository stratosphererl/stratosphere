import { Drawable, Transform, Vector3, Name } from "../facets";
import { Entity } from "@react-ecs/core";
import * as constants from "../constants/map";

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function Ball(name: { name?: any }) {
  const draw = (ctx: CanvasRenderingContext2D, transform: Transform) => {
    const { xScale, yScale } = ctx.scales;
    const zScale = 5;
    const radius =
      (constants.FIELD_DIM.z / (constants.FIELD_DIM.z - transform.position.z)) *
      zScale;
    const color = "rgba(255, 255, 255, 1)";
    const shadowColor = "rgba(255, 255, 255, 0.2)"; // translucent version of the same color
    const lineWidth = clamp(radius, zScale, 25) * 1.2; // determines the width of the outline

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      transform.position.x * xScale,
      transform.position.y * yScale,
      clamp(radius, zScale, 25),
      0,
      2 * Math.PI
    );
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  };

  return (
    <Entity>
      <Transform position={new Vector3(0, 0, 0)} />
      <Drawable draw={draw} />
      <Name name={name.name} />
    </Entity>
  );
}
