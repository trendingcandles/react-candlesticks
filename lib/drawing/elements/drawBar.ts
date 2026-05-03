/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BarConfigComplete } from '../../config/elements/bar/BarConfig';

const drawBar = (
  context: CanvasRenderingContext2D,
  valueToY: (value: number) => number,
  highValue: number,
  lowValue: number,
  leftEdge: number,
  widthPx: number,
  barStyle: BarConfigComplete,
) => {

  const {
    backgroundColor,
    borderColor,
    borderWidth,
  } = barStyle;

  const topY =  Math.round(valueToY(highValue));
  const bottomY = valueToY(lowValue);
  const heightPx = Math.round(bottomY - topY);

  if (borderWidth > 0) {
    context.fillStyle = borderColor;
    context.fillRect(leftEdge, topY, widthPx, heightPx);

    context.fillStyle = backgroundColor;
    context.fillRect(leftEdge + 1, topY + 1, widthPx - 2, heightPx - 2);
  } else {
    context.fillStyle = backgroundColor;
    context.fillRect(leftEdge, topY, widthPx, heightPx);
  }

};

export default drawBar;
