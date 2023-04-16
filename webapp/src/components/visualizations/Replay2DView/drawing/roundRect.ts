export const roundRect = (
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  width: number,
  height: number,
  r: number,
  rotation: number = 0 // default rotation is 0
): void => {
  let w = width;
  let h = height;
  if (r > w / 2) r = w / 2;
  if (r > h / 2) r = h / 2;
  const cx = x0 + w / 2; // center x
  const cy = y0 + h / 2; // center y
  ctx.save();
  ctx.translate(cx, cy); // translate to the center point
  ctx.rotate(rotation); // rotate by the specified angle
  ctx.translate(-cx, -cy); // translate back to the original position
  ctx.beginPath();
  ctx.moveTo(x0 + r, y0);
  ctx.lineTo(x0 + w - r, y0);
  ctx.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  ctx.lineTo(x0 + w, y0 + h - r);
  ctx.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  ctx.lineTo(x0 + r, y0 + h);
  ctx.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  ctx.lineTo(x0, y0 + r);
  ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
