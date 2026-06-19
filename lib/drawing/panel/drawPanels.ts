/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import drawPanel from './drawPanel';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { TimeScale } from '../../domain/types/TimeScale';
import ViewportData from '../../domain/types/ViewportData';
import { LayerScale } from '../../config/layer/BaseLayerConfig';
import { DrawingRegistry } from '../../config/drawing/DrawingRegistry';

const drawPanels = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfigs: PanelConfigComplete[],
  layout: Layout,
  timeScale: TimeScale,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  drawingRegistry?: DrawingRegistry,
): Record<string, { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; }> => {

  const metricsByPanel: Record<string, { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; }> = {};

  for (let index = 0; index < panelConfigs.length; index++)  {
    const panelConfig = panelConfigs[index];

    const metrics = drawPanel(
      context,
      axesContext,
      chartConfig,
      panelConfig,
      layout,
      timeScale,
      viewportData,
      chartMetrics,
      index,
      drawingRegistry,
    );

    if (metrics) {
      metricsByPanel[panelConfig.id] = metrics;
    }
  }

  return metricsByPanel;

};

export default drawPanels;
