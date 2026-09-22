import { util } from 'fabric';

import type { controlsUtils } from 'fabric';

function drawRectRounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawCircleIcon(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  __styleOverride: controlsUtils.ControlRenderingStyleOverride | undefined,
  fabricObject: any
) {
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(util.degreesToRadians(fabricObject.angle));
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, 2 * Math.PI);
  ctx.shadowColor = '#333333';
  ctx.shadowBlur = 3;
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

export function drawVerticalLineIcon(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  __styleOverride: controlsUtils.ControlRenderingStyleOverride | undefined,
  fabricObject: any
) {
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(util.degreesToRadians(fabricObject.angle));
  drawRectRounded(ctx, -2, -14, 4, 18, 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#3782F7';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

function getPointOnCircle(
  center: { x: number; y: number },
  radius: number,
  angle: number
) {
  const pX = center.x + Math.cos(angle) * radius;
  const pY = center.y + Math.sin(angle) * radius;
  return { x: pX, y: pY };
}

export function drawHorizontalLineIcon(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  __styleOverride: controlsUtils.ControlRenderingStyleOverride | undefined,
  fabricObject: any
) {
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(util.degreesToRadians(fabricObject.angle));
  drawRectRounded(ctx, -14, -2, 18, 4, 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#3782F7';
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

export function drawRotateIcon(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  __styleOverride: controlsUtils.ControlRenderingStyleOverride | undefined
) {
  const radius = 6;
  const lineWidth = radius / 3;
  const arrowWidth = radius / 2;
  const center = {
    x: left,
    y: top,
  };
  const arrow1 = {
    startAngle: 0.6,
    endAngle: 1.8 * Math.PI,
  };

  const arrow2 = {
    startAngle: (3 / 2) * Math.PI + 0.6,
    endAngle: (1 / 2) * Math.PI,
  };
  function draw(startAngle: number, endAngle: number) {
    ctx.beginPath();
    ctx.shadowBlur = 0;

    ctx.arc(center.x, center.y, radius, startAngle, endAngle);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#3782F7';
    ctx.stroke();

    ctx.beginPath();
    const arrowTop = getPointOnCircle(center, radius, endAngle + 0.4);

    ctx.moveTo(arrowTop.x, arrowTop.y);

    const arrowLeft = getPointOnCircle(center, radius - arrowWidth, endAngle);
    ctx.lineTo(arrowLeft.x, arrowLeft.y);

    const arrowRight = getPointOnCircle(center, radius + arrowWidth, endAngle);
    ctx.lineTo(arrowRight.x, arrowRight.y);
    ctx.fillStyle = '#3782F7';

    ctx.closePath();
    ctx.fill();
  }

  ctx.save();
  ctx.translate(0, 0);

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius + 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 2;
  ctx.shadowColor = 'black';
  ctx.fill();
  ctx.closePath();
  draw(arrow1.startAngle, arrow1.endAngle);
  // draw(arrow2.startAngle, arrow2.endAngle);
  ctx.restore();
}
