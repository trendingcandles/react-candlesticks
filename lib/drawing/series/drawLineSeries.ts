/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfigComplete } from '../../config/elements/line/LineConfig';

export interface DrawLineSeriesOptions {
  context: CanvasRenderingContext2D;
  values: Float64Array;
  lineConfig: LineConfigComplete;
  valueToY: (value: number) => number;
  startBarIndex: number;
  endBarIndex: number;
  intervalSize: number;
  scrollOffset: number;
  barOffset?: number;
}

export interface DrawLineSeriesResult {
  lastBarIndex: number;
}

const drawLineSeries = ({
  context,
  values,
  lineConfig,
  valueToY,
  startBarIndex,
  endBarIndex,
  intervalSize,
  scrollOffset,
  barOffset = 0,
}: DrawLineSeriesOptions): DrawLineSeriesResult | null => {
  let lastBarIndex = -1;
  let lastX = 0;
  let lastY = 0;

  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    const value = values[barIndex];
    if (!Number.isFinite(value)) continue;

    const x = ((barIndex + barOffset) * intervalSize) - scrollOffset;
    const y = valueToY(value);

    if (lastBarIndex < 0) {
      context.save();
      context.strokeStyle = lineConfig.color;
      context.lineWidth = lineConfig.width;
      context.setLineDash(
        lineConfig.style === 'dashed' && lineConfig.dashes
          ? lineConfig.dashes
          : [],
      );
      context.beginPath();
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }

    lastBarIndex = barIndex;
    lastX = x;
    lastY = y;
  }

  if (lastBarIndex < 0) return null;

  context.stroke();

  const isLastAvailablePoint = lastBarIndex === values.length - 1;
  if (isLastAvailablePoint && lineConfig.endDotSize) {
    context.fillStyle = lineConfig.color;
    context.beginPath();
    context.ellipse(
      lastX,
      lastY,
      lineConfig.endDotSize,
      lineConfig.endDotSize,
      Math.PI / 4,
      0,
      2 * Math.PI,
    );
    context.fill();
  }

  context.restore();
  return { lastBarIndex };
};

export default drawLineSeries;
