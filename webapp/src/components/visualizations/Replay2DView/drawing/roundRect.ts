export const roundRect = (
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  width: number,
  height: number,
  r: number
): void => {
  let w = width;
  let h = height;
  if (r > w / 2) r = w / 2;
  if (r > h / 2) r = h / 2;
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
};
