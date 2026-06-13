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
import { StochasticLayerConfigComplete } from './StochasticLayerConfig';
import ViewportData from '../../domain/types/ViewportData';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: BaseLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {
  const stochasticLayerConfig = layerConfig as StochasticLayerConfigComplete;
  drawLineIndicator(context, axesContext, chartConfig, panelConfig, stochasticLayerConfig, layout, viewportData, chartMetrics, panelMetrics, layerMetrics, [
    { output: 'd', line: stochasticLayerConfig.series?.d ?? null, marker: stochasticLayerConfig.markers?.d ?? null },
    { output: 'kSmoothed', line: stochasticLayerConfig.series?.k ?? null, marker: stochasticLayerConfig.markers?.k ?? null },
  ]);
};

export default draw;
