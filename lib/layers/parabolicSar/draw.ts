/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import { ParabolicSarLayerConfigComplete } from './ParabolicSarLayerConfig';

const draw = (
  context: CanvasRenderingContext2D,
  _axesContext: CanvasRenderingContext2D,
  _chartConfig: ChartConfigComplete,
  _panelConfig: PanelConfigComplete,
  layerConfig: ParabolicSarLayerConfigComplete,
  _layout: Layout,
  viewportData: ViewportData,
  _chartMetrics: ChartMetrics | null,
  _panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {
  if (!layerMetrics) return;
  const config = layerConfig;
  const line = config.series.value;
  if (!line) return;

  const {
    timeScale: {
      metadata: { intervalSize, scrollOffset },
      startBarIndex,
      endBarIndex,
    },
    layersData: { layerDataInstances },
  } = viewportData;
  const values = layerDataInstances[config.id]?.outputValues.value;
  if (!values) return;

  context.save();
  context.fillStyle = line.color;
  const radius = Math.max(1.5, line.width * 1.5);
  const firstBarIndex = Math.max(0, startBarIndex);
  const lastBarIndex = Math.min(endBarIndex, values.length - 1);
  for (let barIndex = firstBarIndex; barIndex <= lastBarIndex; barIndex++) {
    const value = values[barIndex];
    if (!Number.isFinite(value)) continue;
    const x = (barIndex * intervalSize) - scrollOffset;
    const y = layerMetrics.valueToY(value);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
};

export default draw;
