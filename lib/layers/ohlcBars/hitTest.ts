/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import { OhlcBarsLayerConfigComplete } from './OhlcBarsLayerConfig';

const hitTest = ({
  layerConfig,
  pointer,
  valueToY,
  viewportData,
}: LayerHitTestContext<OhlcBarsLayerConfigComplete>) => {
  const barIndex = pointer.barIndex;
  if (barIndex === undefined) return null;

  const {
    timeScale: {
      startBarIndex,
      endBarIndex,
      metadata: { intervalSize, scrollOffset },
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

  const x = barIndex * intervalSize - scrollOffset;
  const openY = valueToY(open[barIndex]);
  const closeY = valueToY(close[barIndex]);
  const highY = valueToY(high[barIndex]);
  const lowY = valueToY(low[barIndex]);
  const bar = layerConfig.series.bars?.[variantKey];
  const halfTickWidth = bar ? Math.max(3, Math.round(intervalSize * bar.width)) / 2 + 3 : 0;
  const onVertical = bar &&
    Math.abs(pointer.panelX - x) <= 4 &&
    pointer.chartY >= highY - 3 &&
    pointer.chartY <= lowY + 3;
  const onOpenTick = bar &&
    pointer.panelX >= x - halfTickWidth &&
    pointer.panelX <= x + 3 &&
    Math.abs(pointer.chartY - openY) <= 4;
  const onCloseTick = bar &&
    pointer.panelX >= x - 3 &&
    pointer.panelX <= x + halfTickWidth &&
    Math.abs(pointer.chartY - closeY) <= 4;

  if (!onVertical && !onOpenTick && !onCloseTick) return null;

  return {
    target: onOpenTick ? 'ohlc-open' : onCloseTick ? 'ohlc-close' : 'ohlc-bar',
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
