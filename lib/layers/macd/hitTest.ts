/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext, LayerHitTestResult } from '../../config/layer/Layer';
import hitTestLineIndicator from '../../drawing/layer/hitTestLineIndicator';
import { MacdLayerConfigComplete } from './MacdLayerConfig';

const hitTestHistogram = (
  hitTestContext: LayerHitTestContext<MacdLayerConfigComplete>,
): LayerHitTestResult | null => {
  const {
    layerConfig,
    pointer,
    valueToY,
    viewportData: {
      timeScale: {
        metadata: { intervalSize, scrollOffset },
        startBarIndex,
        endBarIndex,
      },
      layersData: { layerDataInstances },
    },
  } = hitTestContext;
  const values = layerDataInstances[layerConfig.id]?.outputValues.histogram;
  if (!values) return null;

  const barIndex = pointer.barIndex;
  if (barIndex === undefined || barIndex < startBarIndex || barIndex > endBarIndex) return null;

  const value = values[barIndex];
  if (!Number.isFinite(value)) return null;

  const barConfig = value >= 0
    ? layerConfig.series.histogramUp
    : layerConfig.series.histogramDown;
  if (!barConfig) return null;

  const x = (barIndex * intervalSize) - scrollOffset;
  const barWidth = Math.max(1, Math.round(intervalSize * barConfig.width));
  const left = x - (barWidth / 2);
  const right = left + barWidth;
  const y0 = valueToY(0);
  const y1 = valueToY(value);
  const top = Math.min(y0, y1) - 2;
  const bottom = Math.max(y0, y1) + 2;

  if (pointer.panelX < left || pointer.panelX > right || pointer.chartY < top || pointer.chartY > bottom) {
    return null;
  }

  return {
    target: 'histogram',
    cursor: 'pointer',
    data: {
      output: 'histogram',
      barIndex,
      value,
    },
  };
};

const hitTest = (hitTestContext: LayerHitTestContext<MacdLayerConfigComplete>) => {
  const { layerConfig } = hitTestContext;

  return hitTestLineIndicator(hitTestContext, [
    { output: 'macd', line: layerConfig.series.macd },
    { output: 'signal', line: layerConfig.series.signal },
  ]) ?? hitTestHistogram(hitTestContext);
};

export default hitTest;
