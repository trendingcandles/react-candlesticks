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
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import drawLineIndicator from '../../drawing/layer/drawLineIndicator';
import { RsiLayerConfigComplete } from './RsiLayerConfig';
import ViewportData from '../../domain/types/ViewportData';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: RsiLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {
  const rsiLayerConfig = layerConfig;
  drawLineIndicator(context, axesContext, chartConfig, panelConfig, rsiLayerConfig, layout, viewportData, chartMetrics, panelMetrics, layerMetrics, [
    { output: 'value', line: rsiLayerConfig.series?.value ?? null, marker: rsiLayerConfig.markers?.value ?? null },
  ]);
};

export default draw;
