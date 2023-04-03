import { roundRect } from "../drawing/roundRect";
import { Drawable, Transform, Vector3, IsOrange } from "../facets";
import { Entity } from "@react-ecs/core";

export function Player({
  isOrange,
  children,
}: {
  isOrange: boolean;
  children?: React.ReactNode;
}) {
  const draw = (ctx: CanvasRenderingContext2D, transform: Transform) => {
    const { xScale, yScale } = ctx.scales;

    const radius = 10;
    const color = isOrange ? "rgba(247, 136, 40, 1)" : "rgba(61, 122, 247, 1)";
    const shadowColor = isOrange
      ? "rgba(247, 136, 40, 0.2)"
      : "rgba(61, 122, 247, 0.2)";
    const lineWidth = radius * 1.2; // determines the width of the outline

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    roundRect(
      ctx,
      transform.position.x * xScale,
      transform.position.y * yScale,
      20,
      35,
      10
    );
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  };

  return (
    <Entity>
      {children}
      <Drawable draw={draw} />
      <Transform position={new Vector3(0, 0, 0)} />
      {isOrange && <IsOrange />}
    </Entity>
  );
}
