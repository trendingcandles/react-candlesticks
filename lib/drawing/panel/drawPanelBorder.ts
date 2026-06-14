/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';

const drawPanelBorder = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layers: BaseLayerConfigComplete[],
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics,
  panelMetrics: PanelMetrics,
) => {

  const {
    drawingAreaX, drawingAreaX1,
  } = layout;

  const { borderTop } = panelConfig;

  if (!borderTop) return;

  const {
    color,
    width,
    style,
    dashes,
  } = borderTop;

  const {
    topPx,
  } = panelMetrics;

  context.strokeStyle = color;
  context.lineWidth = width;
  if (style === 'dashed' && dashes) {
    context.setLineDash(dashes);
  }
  context.beginPath();
  context.moveTo(drawingAreaX, topPx - 1);
  context.lineTo(drawingAreaX1, topPx - 1);
  context.stroke();
  context.setLineDash([]);

};

export default drawPanelBorder;
