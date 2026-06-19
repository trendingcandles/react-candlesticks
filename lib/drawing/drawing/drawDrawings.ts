/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import createDrawingContext from './createDrawingContext';

const drawDrawings = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  layerMetricsByScale: Record<string, LayerMetrics>,
  drawingRegistry: DrawingRegistry = {},
) => {
  const drawings = panelConfig.drawings ?? [];

  if (drawings.length === 0) return;

  context.save();
  context.beginPath();
  context.rect(0, panelMetrics.topPx, layout.drawingAreaWidth, panelMetrics.heightPx);
  context.clip();

  for (const drawingConfig of drawings) {
    if (drawingConfig.visible === false) continue;

    const drawing = drawingRegistry[drawingConfig.type];
    if (!drawing) continue;

    drawing.draw(createDrawingContext({
      context,
      axesContext,
      chartConfig,
      panelConfig,
      drawingConfig,
      layout,
      viewportData,
      chartMetrics,
      panelMetrics,
      layerMetricsByScale,
    }));
  }

  context.restore();
};

export default drawDrawings;
