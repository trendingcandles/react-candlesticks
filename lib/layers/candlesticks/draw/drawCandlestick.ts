/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import drawCandleBody from './drawCandleBody';
import drawCandleWick from './drawCandleWick';
import { PanelConfigComplete } from '../../../config/panel/PanelConfig';
import { CandlestickLayerConfigComplete } from '../CandlestickLayerConfig';
import utcToLocal from '../../../utils/time/utcToLocal';

const CANDLESTICK_DEBUG = false;

const drawCandlestick = (
  context: CanvasRenderingContext2D,
  panelConfig: PanelConfigComplete,
  candlestickslayerConfig: CandlestickLayerConfigComplete,
  intervalWidthPx: number,
  priceToY: (price: number) => number,
  open: number,
  high: number,
  low: number,
  close: number,
  x: number,
  ts: number,
) => {

  const openY = priceToY(open);
  const closeY = priceToY(close);
  const highY = priceToY(high);
  const lowY = priceToY(low);

  let variantKey: 'up' | 'down' | 'flat';
  if (close > open) variantKey = 'up';
  else if (close < open) variantKey = 'down';
  else variantKey = 'flat';

  drawCandleWick(context, candlestickslayerConfig, variantKey, x, highY, lowY);
  drawCandleBody(context, candlestickslayerConfig, variantKey, x, openY, closeY, intervalWidthPx);

  if (CANDLESTICK_DEBUG) {
    context.font = '8px Arial';
    const localTs = utcToLocal(ts, 'America/New_York');
    const timeString = `${localTs.year}-${(localTs.month + 1)}-${localTs.day} ${localTs.hour}:${localTs.minute}`;
    context.fillText(timeString, x, highY - 20);
  }

};

export default drawCandlestick;
