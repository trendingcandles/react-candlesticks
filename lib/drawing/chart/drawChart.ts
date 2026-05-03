/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import drawPanels from '../panel/drawPanels';
import calculateChartMetrics from '../../metrics/chart/calculateChartMetrics';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawTimeGridLines from './grid/time/drawTimeGridLines';
import drawTimeGridLabels from './grid/time/drawTimeGridLabels';
import drawBorders from './borders/drawBorders';
import ViewportData from '../../domain/types/ViewportData';

const drawChart = (
  drawingsContext: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panels: PanelConfigComplete[],
  viewportData: ViewportData,
  layout: Layout,
) => {

  const { timeScale } = viewportData;

  drawingsContext.save();
  drawingsContext.setTransform(1, 0, 0, 1, 0, 0);
  drawingsContext.clearRect(0, 0, drawingsContext.canvas.width, drawingsContext.canvas.height);
  drawingsContext.restore();
  
  axesContext.save();
  axesContext.setTransform(1, 0, 0, 1, 0, 0);
  axesContext.clearRect(0, 0, axesContext.canvas.width, axesContext.canvas.height);
  axesContext.restore();

  const chartMetrics = calculateChartMetrics(panels, layout);

  if (chartMetrics === null) return;

  drawBorders(
    axesContext,
    layout,
    chartConfig,
  );

  drawTimeGridLines(
    drawingsContext,
    layout,
    chartConfig,
    timeScale,
  );

  drawTimeGridLabels(
    drawingsContext,
    layout,
    chartConfig,
    timeScale,
  );

  const metricsByPanel = drawPanels(
    drawingsContext,
    axesContext,
    chartConfig,
    panels,
    layout,
    timeScale,
    viewportData,
    chartMetrics,
  );

  return metricsByPanel;

};

export default drawChart;