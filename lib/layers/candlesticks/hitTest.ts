/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import { CandlestickLayerConfigComplete } from './CandlestickLayerConfig';

const hitTest = ({
  layerConfig,
  pointer,
  valueToY,
  viewportData,
}: LayerHitTestContext<CandlestickLayerConfigComplete>) => {
  const barIndex = pointer.barIndex;
  if (barIndex === undefined) return null;

  const {
    timeScale: {
      startBarIndex,
      endBarIndex,
      metadata: { intervalSize },
    },
    dataMap: {
      ohlcvs: {
        open,
        high,
        low,
        close,
        timestamp,
      },
    },
  } = viewportData;

  if (barIndex < startBarIndex || barIndex > endBarIndex || !Number.isFinite(close[barIndex])) {
    return null;
  }

  let variantKey: 'up' | 'down' | 'flat';
  if (close[barIndex] > open[barIndex]) variantKey = 'up';
  else if (close[barIndex] < open[barIndex]) variantKey = 'down';
  else variantKey = 'flat';

  const x = barIndex * intervalSize - viewportData.timeScale.metadata.scrollOffset;
  const openY = valueToY(open[barIndex]);
  const closeY = valueToY(close[barIndex]);
  const highY = valueToY(high[barIndex]);
  const lowY = valueToY(low[barIndex]);
  const body = layerConfig.series.body?.[variantKey];
  const bodyWidth = body ? Math.max(3, Math.round(intervalSize * body.width)) : 0;
  const bodyHalfWidth = bodyWidth / 2 + 3;
  const bodyTop = Math.min(openY, closeY) - 3;
  const bodyBottom = Math.max(openY, closeY) + 3;
  const onBody = body &&
    Math.abs(pointer.panelX - x) <= bodyHalfWidth &&
    pointer.chartY >= bodyTop &&
    pointer.chartY <= bodyBottom;
  const onWick = layerConfig.series.wick &&
    Math.abs(pointer.panelX - x) <= 4 &&
    pointer.chartY >= highY - 3 &&
    pointer.chartY <= lowY + 3;

  if (!onBody && !onWick) return null;

  return {
    target: onBody ? 'candle-body' : 'candle-wick',
    cursor: 'pointer',
    data: {
      barIndex,
      timestamp: timestamp[barIndex],
      open: open[barIndex],
      high: high[barIndex],
      low: low[barIndex],
      close: close[barIndex],
    },
  };
};

export default hitTest;
