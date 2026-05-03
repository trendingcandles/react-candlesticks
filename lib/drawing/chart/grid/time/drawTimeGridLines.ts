/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../../config/chart/ChartConfig';
import { Layout } from '../../../../domain/types/Layout';
import { TimeScale } from '../../../../domain/types/TimeScale';

const DEBUG = false;
export const MINIMUM_LABEL_SEPARATION_PX = 60;

const drawTimeGridLines = (
  context: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
  timeScale: TimeScale,
) => {

  const {
    drawingAreaY,
    drawingAreaY1,
  } = layout;

  const { grid } = chartConfig;

  if (!grid) return;

  const { time: timeGridLineConfig } = grid;

  if (!timeGridLineConfig) return;

  const { width, color } = timeGridLineConfig;

  const {
    metadata: {
      intervalSize,
      scrollOffset,
    },
    gridLines,
  } = timeScale;

  if (gridLines.length >= 1) {
    context.lineWidth = width;
    context.strokeStyle = color;
    context.beginPath();

    for (let i = 0; i < gridLines.length; i++) {
      const gridLine = gridLines[i];

      const x = (gridLine.barIndex * intervalSize) - scrollOffset;
      const lineX = x + 0.5;

      context.moveTo(lineX, drawingAreaY);
      context.lineTo(lineX, drawingAreaY1);
    }

    context.stroke();
  }

  if (DEBUG) {
    if (gridLines.length >= 1) {
      context.lineWidth = 2;
      context.strokeStyle = color;
      context.beginPath();

      for (let i = 0; i < gridLines.length; i++) {
        const gridLine = gridLines[i];

        if (gridLine.major) {
          const x = (gridLine.barIndex * intervalSize) - scrollOffset;
          const lineX = x + 0.5;

          context.moveTo(lineX, drawingAreaY);
          context.lineTo(lineX, drawingAreaY1);
        }
      }

      context.stroke();
    }
  }

};

export default drawTimeGridLines;
