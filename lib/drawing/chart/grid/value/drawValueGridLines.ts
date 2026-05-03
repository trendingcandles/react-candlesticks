/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../../../config/panel/PanelConfig';
import { Layout } from '../../../../domain/types/Layout';
import { PanelMetrics } from '../../../../domain/types/metrics/PanelMetrics';
import { ValueGridLine } from './ValueGridLine';

const drawValueGridLines = (
  context: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  valueGridLines: ValueGridLine[],
  panelMetrics: PanelMetrics,
) => {

  const { drawingAreaWidth } = layout;

  const {
    topPx,
    bottomPx,
  } = panelMetrics;

  const { grid } = chartConfig;

  if (!grid) return;

  const { value: valueGridLineConfig } = grid;

  if (!valueGridLineConfig) return;

  const { width, color } = valueGridLineConfig;

  context.lineWidth = width;
  context.strokeStyle = color;

  for (let lineIndex = 0; lineIndex < valueGridLines.length; lineIndex++) {
    const { y } = valueGridLines[lineIndex];
    if (y > topPx && y < bottomPx) {
      const yPx = y + 0.5;
      context.beginPath();
      context.moveTo(0, yPx);
      context.lineTo(drawingAreaWidth, yPx);
      context.stroke();
    }
  }

};

export default drawValueGridLines;
