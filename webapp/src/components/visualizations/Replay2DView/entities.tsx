import { Drawable, Transform, Vector3, IsOrange } from "./facets";
import { Entity } from "@react-ecs/core";

export function Player({ isOrange }: { isOrange: boolean }) {
  const draw = (ctx: CanvasRenderingContext2D, transform: Transform) => {
    const radius = 10;
    const color = isOrange ? "rgba(247, 136, 40, 1)" : "rgba(61, 122, 247, 1)";
    const shadowColor = isOrange
      ? "rgba(247, 136, 40, 0.2)"
      : "rgba(61, 122, 247, 0.2)";
    const lineWidth = radius * 1.2; // determines the width of the outline

    ctx.beginPath();
    ctx.arc(transform.position.x, transform.position.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  return (
    <Entity>
      <Transform position={new Vector3(100, 100, 0)} />
      <Drawable draw={draw} />
      {isOrange && <IsOrange />}
    </Entity>
  );
}

export function Ball() {
  const draw = (ctx: CanvasRenderingContext2D, transform: Transform) => {
    const radius = 10;
    const color = "rgba(255, 255, 255, 1)"; // orange color
    const shadowColor = "rgba(255, 255, 255, 0.2)"; // translucent version of the same color
    const lineWidth = radius * 1.2; // determines the width of the outline

    ctx.beginPath();
    ctx.arc(transform.position.x, transform.position.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  return (
    <Entity>
      <Transform position={new Vector3(50, 50, 0)} />
      <Drawable draw={draw} />
    </Entity>
  );
}
