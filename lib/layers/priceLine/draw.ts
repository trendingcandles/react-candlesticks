/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawLineIndicator from '../../drawing/layer/drawLineIndicator';
import ViewportData from '../../domain/types/ViewportData';
import { PriceLineLayerConfigComplete } from './PriceLineLayerConfig';
import { LayerConfigComplete } from '../../config/layer/LayerConfig';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: LayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {
  const priceLineLayerConfig = layerConfig as PriceLineLayerConfigComplete;
  drawLineIndicator(context, axesContext, chartConfig, panelConfig, priceLineLayerConfig, layout, viewportData, chartMetrics, panelMetrics, layerMetrics, [
    { output: 'price', line: priceLineLayerConfig.series?.value ?? null, marker: priceLineLayerConfig.markers?.value ?? null },
  ]);
};

export default draw;
