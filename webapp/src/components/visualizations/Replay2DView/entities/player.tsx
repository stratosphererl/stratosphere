import { roundRect } from "../drawing/roundRect";
import { Drawable, Transform, Vector3, IsOrange, Name } from "../facets";
import { Entity } from "@react-ecs/core";

export function Player({
  username,
  isOrange,
  children,
  name,
}: {
  username: string;
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

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    roundRect(
      ctx,
      (transform.position.x + width / 2) * xScale,
      (transform.position.y + height / 2) * yScale,
      width * Math.abs(xScale),
      height * Math.abs(yScale),
      10
    );
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText(
      username,
      transform.position.x * xScale,
      (transform.position.y + 500) * yScale
    );
    ctx.restore();
  };

  return (
    <Entity>
      {children}
      <Drawable draw={draw} />
      <Transform position={new Vector3(0, 0, 0)} />
      <Name name={name} />
      {isOrange && <IsOrange />}
    </Entity>
  );
}
