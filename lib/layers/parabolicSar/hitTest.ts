/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import { ParabolicSarLayerConfigComplete } from './ParabolicSarLayerConfig';

const hitTest = (hitTestContext: LayerHitTestContext<ParabolicSarLayerConfigComplete>) => {
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
  const line = layerConfig.series.value;
  if (!line) return null;

  const values = layerDataInstances[layerConfig.id]?.outputValues.value;
  if (!values) return null;

  const barIndex = pointer.barIndex;
  if (barIndex === undefined || barIndex < startBarIndex || barIndex > endBarIndex) return null;

  const value = values[barIndex];
  if (!Number.isFinite(value)) return null;

  const x = (barIndex * intervalSize) - scrollOffset;
  const y = valueToY(value);
  const distancePx = Math.hypot(pointer.panelX - x, pointer.chartY - y);
  const tolerancePx = Math.max(4, line.width * 1.5 + 3);

  if (distancePx > tolerancePx) return null;

  return {
    target: 'point',
    cursor: 'pointer',
    data: {
      output: 'value',
      barIndex,
      value,
      distancePx,
    },
  };
};

export default hitTest;
