/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../../config/chart/ChartConfig';
import { Layout } from '../../../../domain/types/Layout';
import { TimeScale } from '../../../../domain/types/TimeScale';
import drawTimeGridLabel from '../../../elements/labels/timeLabel/drawTimeGridLabel';

export const MINIMUM_LABEL_SEPARATION_PX = 40;

const drawTimeGridLabels = (
  context: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
  timeScale: TimeScale,
) => {

  const {
    drawingAreaY1
  } = layout;

  const { xAxis } = chartConfig;

  if (!xAxis) return;

  const {
    majorLabels,
    minorLabels,
    timeZoneId,
  } = xAxis;

  if (!majorLabels && !minorLabels) return;

  const {
    metadata: {
      intervalSize,
      scrollOffset,
    },
    gridLines,
  } = timeScale;

  if (gridLines.length >= 1) {
    context.beginPath();

    let prevDrawnLabelX = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < gridLines.length; i++) {
      const gridLine = gridLines[i];

      const x = (gridLine.barIndex * intervalSize) - scrollOffset;
      const lineX = x + 0.5;

      const separationFromPrevDrawnLabelX = lineX - prevDrawnLabelX;

      if (minorLabels && !gridLine.major && separationFromPrevDrawnLabelX > MINIMUM_LABEL_SEPARATION_PX) {
        drawTimeGridLabel(
          context,
          drawingAreaY1,
          lineX,
          gridLine,
          gridLine.timestamp,
          minorLabels,
          timeZoneId,
        );
        prevDrawnLabelX = lineX;
      }

      if (majorLabels && gridLine.major) {
        drawTimeGridLabel(
          context,
          drawingAreaY1,
          lineX,
          gridLine,
          gridLine.timestamp,
          majorLabels,
          timeZoneId,
        );
        prevDrawnLabelX = lineX;
      }
    }

    context.stroke();
  }

};

export default drawTimeGridLabels;
