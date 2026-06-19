/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import { VolumeBarsLayerConfigComplete } from './VolumeBarsLayerConfig';

const hitTest = (hitTestContext: LayerHitTestContext<VolumeBarsLayerConfigComplete>) => {
  const {
    layerConfig,
    pointer,
    valueToY,
    panelMetrics,
    viewportData: {
      timeScale: {
        metadata: { intervalSize, scrollOffset },
        startBarIndex,
        endBarIndex,
      },
      dataMap: {
        ohlcvs: {
          open,
          close,
          volume,
          timestamp,
        },
      },
    },
  } = hitTestContext;
  const bars = layerConfig.series.bars;
  if (!bars) return null;

  const barIndex = pointer.barIndex;
  if (barIndex === undefined || barIndex < startBarIndex || barIndex > endBarIndex) return null;

  const volumeValue = volume[barIndex];
  if (!Number.isFinite(volumeValue)) return null;

  let variantKey: 'up' | 'down' | 'flat';
  if (close[barIndex] > open[barIndex]) variantKey = 'up';
  else if (close[barIndex] < open[barIndex]) variantKey = 'down';
  else variantKey = 'flat';

  let widthPx = Math.round(intervalSize * bars[variantKey].width);
  if (widthPx % 2 === 0) widthPx += 1;

  const x = (barIndex * intervalSize) - scrollOffset;
  const left = Math.round(x - widthPx / 2);
  const right = left + widthPx;
  const top = Math.round(valueToY(volumeValue)) - 2;
  const bottom = Math.round(panelMetrics.paddedBottomPx) + 2;

  if (pointer.panelX < left || pointer.panelX > right || pointer.chartY < top || pointer.chartY > bottom) {
    return null;
  }

  return {
    target: 'bar',
    cursor: 'pointer',
    data: {
      output: 'volume',
      barIndex,
      timestamp: timestamp[barIndex],
      value: volumeValue,
      variant: variantKey,
    },
  };
};

export default hitTest;
