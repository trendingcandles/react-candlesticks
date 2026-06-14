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
import { EmaLayerConfigComplete } from './EmaLayerConfig';
import ViewportData from '../../domain/types/ViewportData';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: EmaLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
) => {
  const emaLayerConfig = layerConfig;
  drawLineIndicator(context, axesContext, chartConfig, panelConfig, emaLayerConfig, layout, viewportData, chartMetrics, panelMetrics, layerMetrics, [
    {
      output: 'value',
      line: emaLayerConfig.series?.value ?? null,
      marker: emaLayerConfig.markers?.value ?? null,
      barOffset: emaLayerConfig.offset,
    },
  ]);
};

export default draw;
