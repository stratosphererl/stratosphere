import { roundRect } from "../drawing/roundRect";
import { Drawable, Transform, Vector3, IsOrange, Name, Frame } from "../facets";
import { Entity } from "@react-ecs/core";

export function Player({
  isOrange,
  children,
  name,
}: {
  isOrange: boolean;
  children?: React.ReactNode;
  name?: any;
}) {
  const draw = (ctx: CanvasRenderingContext2D, transform: Transform) => {
    const { xScale, yScale } = ctx.scales;

    const radius = 10;
    const color = isOrange ? "rgba(247, 136, 40, 1)" : "rgba(61, 122, 247, 1)";
    const shadowColor = isOrange
      ? "rgba(247, 136, 40, 0.2)"
      : "rgba(61, 122, 247, 0.2)";
    const lineWidth = radius * 1.2; // determines the width of the outline

    const width = 180;
    const height = 500;

    const x = transform.position.x + width / 2;
    const y = transform.position.y + height / 2;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    roundRect(
      ctx,
      x * xScale,
      y * yScale,
      width * Math.abs(xScale),
      height * Math.abs(yScale),
      10,
      0
    );
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText(name.name, x * xScale, (y + 100) * yScale);
    ctx.restore();
  };

  return (
    <Entity>
      {children}
      <Drawable draw={draw} />
      <Transform />
      <Name name={name.name} id={name.id} />
      {isOrange && <IsOrange />}
      <Frame />
    </Entity>
  );
}
