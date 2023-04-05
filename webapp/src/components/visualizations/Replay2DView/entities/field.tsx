import { Entity } from "@react-ecs/core";
import { Drawable, Transform } from "../facets";
import * as constants from "../constants/map";

export function Map() {
  const draw = (ctx: CanvasRenderingContext2D) => {
    drawGoal(ctx, true);
    drawGoal(ctx, false);
    drawHalfwayLine(ctx);
    drawCenterCircle(ctx);
    // drawBoostPads(ctx);
    drawSide(ctx, true);
    drawSide(ctx, false);
  };

  const drawSide = (ctx: CanvasRenderingContext2D, isOrange: boolean) => {
    const { xScale, yScale } = ctx.scales;

    // draw the side
    ctx.save();
    ctx.beginPath();

    ctx.strokeStyle = isOrange
      ? "rgba(247, 136, 40, 0.75)"
      : "rgba(61, 122, 247, 0.75)";

    ctx.lineWidth = 3;

    // decides whether to draw the orange or blue side
    const sideMultiplier = isOrange ? 1 : -1;

    for (let i = 0; i <= 1; i++) {
      // decides whether to draw the left or right side
      const mirrorMultiplier = i % 2 == 0 ? 1 : -1;

      let x = (constants.GOAL_DIM.x / 2) * xScale;
      let y = (-constants.MAP_LIMS.y.min - constants.GOAL_DIM.y) * yScale;

      ctx.moveTo(mirrorMultiplier * x, sideMultiplier * y);

      x = (-constants.MAP_LIMS.x.min - constants.CORNER_BOX_DIM.x) * xScale;
      y = (-constants.MAP_LIMS.y.min - constants.GOAL_DIM.y) * yScale;

      ctx.lineTo(mirrorMultiplier * x, sideMultiplier * y);

      x += constants.CORNER_BOX_DIM.x * xScale;
      y -= constants.CORNER_BOX_DIM.y * yScale;

      ctx.lineTo(mirrorMultiplier * x, sideMultiplier * y);

      x = (constants.FIELD_DIM.x / 2) * xScale;
      y = 0;

      ctx.lineTo(mirrorMultiplier * x, sideMultiplier * y);
    }
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
  };

  const drawHalfwayLine = (ctx: CanvasRenderingContext2D) => {
    const { xScale, yScale } = ctx.scales;

    ctx.save();
    ctx.beginPath();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 3;

    ctx.moveTo((constants.FIELD_DIM.x / 2) * xScale, 0);
    ctx.lineTo(constants.FIELD_DIM.x, 0);

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const drawCenterCircle = (ctx: CanvasRenderingContext2D) => {
    const { xScale, yScale } = ctx.scales;

    ctx.save();
    ctx.beginPath();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;

    ctx.arc(0, 0, 50, 0, 2 * Math.PI);

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const drawBoostPads = (ctx: CanvasRenderingContext2D) => {
    const { xScale, yScale } = ctx.scales;

    ctx.save();

    ctx.fillStyle = "rgba(252, 252, 3, 0.2)";
    ctx.lineWidth = 2;

    for (let i = 0; i < constants.SMALL_BOOST_PAD_POS.length; i++) {
      ctx.beginPath();
      const [x, y] = constants.SMALL_BOOST_PAD_POS[i];
      ctx.arc(x * xScale, y * yScale, 3, 0, 2 * Math.PI);

      ctx.fill();
      ctx.closePath();
    }

    for (let i = 0; i < constants.LARGE_BOOST_PAD_POS.length; i++) {
      ctx.beginPath();
      const [x, y] = constants.LARGE_BOOST_PAD_POS[i];
      ctx.arc(x * xScale, y * yScale, 5, 0, 2 * Math.PI);

      ctx.fill();
      ctx.closePath();
    }

    ctx.restore();
  };

  const drawGoal = (ctx: CanvasRenderingContext2D, isOrange: boolean) => {
    const { xScale, yScale } = ctx.scales;

    const goalLocation = {
      x: (-constants.GOAL_DIM.x / 2) * xScale,
      y: isOrange
        ? (constants.FIELD_DIM.y / 2 - constants.GOAL_DIM.y) * yScale
        : (-constants.FIELD_DIM.y / 2) * yScale,
    };

    ctx.save();
    ctx.lineWidth = 3;
    ctx.beginPath();

    ctx.strokeStyle = isOrange
      ? "rgba(247, 136, 40, 0.75)"
      : "rgba(61, 122, 247, 0.75)";

    ctx.strokeRect(
      goalLocation.x,
      goalLocation.y,
      constants.GOAL_DIM.x * xScale,
      constants.GOAL_DIM.y * yScale
    );

    ctx.closePath();
    ctx.restore();
  };

  return (
    <Entity>
      <Drawable draw={draw} />
    </Entity>
  );
}
