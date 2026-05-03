/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { CandlestickLayerConfigComplete } from '../CandlestickLayerConfig';

const drawCandleWick = (
  context: CanvasRenderingContext2D,
  candlestickslayerConfig: CandlestickLayerConfigComplete,
  variantKey: 'up' | 'down' | 'flat',
  x: number,
  highY: number,
  lowY: number,
) => {

  const {
    series: {
      wick,
    },
  } = candlestickslayerConfig;

  if (!wick) return;

  const { width, color } = wick[variantKey];

  const xPx = Math.round(x) + 0.5;

  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(xPx, highY);
  context.lineTo(xPx, lowY);
  context.stroke();
};

export default drawCandleWick;
