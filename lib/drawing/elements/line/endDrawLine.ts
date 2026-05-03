/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfigComplete } from '../../../config/elements/line/LineConfig';

const endDrawLine = (
  context: CanvasRenderingContext2D,
  valueToY: (value: number) => number,
  value: number,
  x: number,
  lineStyle: LineConfigComplete,
  isLast?: boolean,
) => {

  context.stroke();

  if (lineStyle.style === 'dashed') {
    context.setLineDash([]);
  }

  const {
    color,
    endDotSize,
  } = lineStyle;

  if (isLast && endDotSize) {
    const y = valueToY(value);

    context.fillStyle = color;
    context.beginPath();
    context.ellipse(x, y, endDotSize, endDotSize, Math.PI / 4, 0, 2 * Math.PI);
    context.fill();
  }

};

export default endDrawLine;
