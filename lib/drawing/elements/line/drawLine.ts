/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const drawLine = (
  context: CanvasRenderingContext2D,
  valueToY: (value: number) => number,
  value: number,
  x: number,
): number => {

  const y = valueToY(value);

  context.lineTo(x, y);
  return y;

};

export default drawLine;
