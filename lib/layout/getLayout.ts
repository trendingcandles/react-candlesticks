/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../config/chart/ChartConfig';
import { PanelConfigComplete } from '../config/panel/PanelConfig';
import { Layout } from '../domain/types/Layout';

const getLayout = (
  chartWidth: number,
  chartHeight: number,
  dpr: number,
  chartConfig: ChartConfigComplete,
  panelConfigs: PanelConfigComplete[],
): Layout => {

  const leftAxisMaxWidth = Math.max(...panelConfigs.map(p => p.yAxes.leftTotalWidth));
  const rightAxisMaxWidth = Math.max(...panelConfigs.map(p => p.yAxes.rightTotalWidth));

  const { xAxis } = chartConfig;

  const timeAxis = xAxis;

  const effectiveTimeAxisHeight = timeAxis ? timeAxis.height : 0;

  const drawingAreaX = leftAxisMaxWidth;
  const drawingAreaX1 = chartWidth - rightAxisMaxWidth;
  const drawingAreaY = 0;
  const drawingAreaWidth = drawingAreaX1 - drawingAreaX;
  const drawingAreaHeight = chartHeight - effectiveTimeAxisHeight;
  const drawingAreaY1 = drawingAreaY + drawingAreaHeight;
  const drawingAreaRight = chartWidth - drawingAreaX1;
  const drawingAreaBottom = chartHeight - drawingAreaY1;

  return {
    dpr,

    chartWidth,
    chartHeight,

    drawingAreaX,
    drawingAreaY,
    drawingAreaWidth,
    drawingAreaHeight,
    drawingAreaX1,
    drawingAreaY1,
    drawingAreaRight,
    drawingAreaBottom,
  };
};

export default getLayout;
