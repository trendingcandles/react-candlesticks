/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const drawRoundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 0,
  mode: 'fill' | 'stroke' = 'fill',
) => {
  const effectiveRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

  if (effectiveRadius === 0) {
    if (mode === 'fill') {
      context.fillRect(x, y, width, height);
    } else {
      context.beginPath();
      context.rect(x, y, width, height);
      context.stroke();
    }
    return;
  }

  const right = x + width;
  const bottom = y + height;

  context.beginPath();
  context.moveTo(x + effectiveRadius, y);
  context.lineTo(right - effectiveRadius, y);
  context.quadraticCurveTo(right, y, right, y + effectiveRadius);
  context.lineTo(right, bottom - effectiveRadius);
  context.quadraticCurveTo(right, bottom, right - effectiveRadius, bottom);
  context.lineTo(x + effectiveRadius, bottom);
  context.quadraticCurveTo(x, bottom, x, bottom - effectiveRadius);
  context.lineTo(x, y + effectiveRadius);
  context.quadraticCurveTo(x, y, x + effectiveRadius, y);
  if (mode === 'fill') {
    context.fill();
  } else {
    context.stroke();
  }
};

export default drawRoundedRect;
