/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfigComplete } from '../../config/elements/line/LineConfig';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import { LayerHitTestContext, LayerHitTestResult } from '../../config/layer/Layer';

export interface HitTestLineIndicatorSeries {
  output: string;
  line: null | LineConfigComplete;
  barOffset?: number;
}

const distanceToSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(x - x1, y - y1);
  }

  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared));
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  return Math.hypot(x - closestX, y - closestY);
};

const hitTestLineIndicator = <C extends BaseLayerConfigComplete>(
  hitTestContext: LayerHitTestContext<C>,
  series: HitTestLineIndicatorSeries[],
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
  const layerDataInstance = layerDataInstances[layerConfig.id];
  if (!layerDataInstance) return null;

  let closestHit: LayerHitTestResult | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const item of series) {
    if (!item.line) continue;

    const values = layerDataInstance.outputValues[item.output];
    if (!values) continue;

    let previousBarIndex = -1;
    let previousX = 0;
    let previousY = 0;
    const barOffset = item.barOffset ?? 0;

    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const value = values[barIndex];
      if (!Number.isFinite(value)) continue;

      const x = ((barIndex + barOffset) * intervalSize) - scrollOffset;
      const y = valueToY(value);

      if (previousBarIndex >= 0) {
        const distancePx = distanceToSegment(pointer.panelX, pointer.chartY, previousX, previousY, x, y);
        const tolerancePx = item.line.width + 6;

        if (distancePx <= tolerancePx && distancePx < closestDistance) {
          closestDistance = distancePx;
          closestHit = {
            target: 'line',
            cursor: 'pointer',
            data: {
              output: item.output,
              barIndex,
              value,
              distancePx,
            },
          };
        }
      }

      previousBarIndex = barIndex;
      previousX = x;
      previousY = y;
    }
  }

  return closestHit;
};

export default hitTestLineIndicator;
