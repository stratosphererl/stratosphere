import { Drawable, Transform, Vector3 } from "../facets";
import { Entity } from "@react-ecs/core";

export function Ball() {
  const draw = (ctx: CanvasRenderingContext2D, transform: Transform) => {
    const radius = 10;
    const color = "rgba(255, 255, 255, 1)";
    const shadowColor = "rgba(255, 255, 255, 0.2)"; // translucent version of the same color
    const lineWidth = radius * 1.2; // determines the width of the outline

    ctx.save();
    ctx.beginPath();
    ctx.arc(transform.position.x, transform.position.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  };

  return (
    <Entity>
      <Transform position={new Vector3(50, 50, 0)} />
      <Drawable draw={draw} />
    </Entity>
  );
}
