/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfigComplete } from '../../../config/elements/line/LineConfig';

const startDrawLine = (
  context: CanvasRenderingContext2D,
  valueToY: (value: number) => number,
  value: number,
  x: number,
  lineStyle: LineConfigComplete,
): number => {

  const {
    color,
    width,
    style,
    dashes,
  } = lineStyle;

  const y = valueToY(value);

  context.strokeStyle = color;
  context.lineWidth = width

  if (style === 'dashed' && dashes) {
    context.setLineDash(dashes);
  }

  context.beginPath();
  context.moveTo(x, y);

  return y;

};

export default startDrawLine;
