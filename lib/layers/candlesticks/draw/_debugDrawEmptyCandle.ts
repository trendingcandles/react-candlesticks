/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const _debugDrawEmptyCandle = (
  context: CanvasRenderingContext2D,
  x: number,
  intervalWidthPx: number,
  height: number
) => {
  context.fillStyle = '#eee';
  context.fillRect(
    x - (intervalWidthPx / 2) - 1,
    height / 2,
    intervalWidthPx - 2,
    48
  );
};

export default _debugDrawEmptyCandle;
