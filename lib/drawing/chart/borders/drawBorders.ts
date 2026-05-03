/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../config/chart/ChartConfig';
import { LineConfigComplete } from '../../../config/elements/line/LineConfig';
import { Layout } from '../../../domain/types/Layout';

const drawBorders = (
  context: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
) => {
  const { drawingAreaX, drawingAreaX1, drawingAreaY, drawingAreaY1 } = layout;
  const { borders } = chartConfig;

  if (!borders) return;

  const { left, right, top, bottom } = borders;

  if (!left && !right && !top && !bottom) return;

  context.lineJoin = 'miter';
  context.lineCap = 'butt';

  // Define corner points
  const topLeft = [drawingAreaX + 0.5, drawingAreaY + 0.5];
  const topRight = [drawingAreaX1 + 0.5, drawingAreaY + 0.5];
  const bottomRight = [drawingAreaX1 + 0.5, drawingAreaY1 - 0.5];
  const bottomLeft = [drawingAreaX + 0.5, drawingAreaY1 - 0.5];

  // Group borders by style to draw continuous paths
  const bordersMatch = (a: LineConfigComplete | null, b: LineConfigComplete | null) =>
    a && b && a.color === b.color && a.style === b.style && a.width === b.width;

  const applyStyle = (config: LineConfigComplete) => {
    context.strokeStyle = config.color;
    context.lineWidth = config.width;
    if (config.style === 'dashed' && config.dashes) {
      context.setLineDash(config.dashes);
    } else {
      context.setLineDash([]);
    }
  };

  const drawn = { left: false, right: false, top: false, bottom: false };

  // Try to draw continuous paths for matching adjacent borders
  const tryDrawPath = (
    sides: Array<'left' | 'right' | 'top' | 'bottom'>,
    configs: Array<LineConfigComplete | null>,
    points: number[][]
  ) => {
    if (configs.some(c => !c) || !configs.every((c, i) => i === 0 || bordersMatch(c, configs[0]))) {
      return false;
    }

    applyStyle(configs[0]!);
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.stroke();

    sides.forEach(side => drawn[side] = true);
    return true;
  };

  // Try drawing all four sides as one path
  tryDrawPath(
    ['left', 'bottom', 'right', 'top'],
    [left, bottom, right, top],
    [topLeft, bottomLeft, bottomRight, topRight, topLeft]
  );

  // Try pairs of adjacent sides
  if (!drawn.left && !drawn.bottom) {
    tryDrawPath(['left', 'bottom'], [left, bottom], [topLeft, bottomLeft, bottomRight]);
  }
  if (!drawn.bottom && !drawn.right) {
    tryDrawPath(['bottom', 'right'], [bottom, right], [bottomLeft, bottomRight, topRight]);
  }
  if (!drawn.right && !drawn.top) {
    tryDrawPath(['right', 'top'], [right, top], [bottomRight, topRight, topLeft]);
  }
  if (!drawn.top && !drawn.left) {
    tryDrawPath(['top', 'left'], [top, left], [topRight, topLeft, bottomLeft]);
  }

  // Draw individual sides
  const drawSide = (
    side: 'left' | 'right' | 'top' | 'bottom',
    config: LineConfigComplete | null,
    start: number[],
    end: number[]
  ) => {
    if (!drawn[side] && config) {
      applyStyle(config);
      context.beginPath();
      context.moveTo(start[0], start[1]);
      context.lineTo(end[0], end[1]);
      context.stroke();
    }
  };

  drawSide('left', left, topLeft, bottomLeft);
  drawSide('bottom', bottom, bottomLeft, bottomRight);
  drawSide('right', right, bottomRight, topRight);
  drawSide('top', top, topRight, topLeft);

  context.setLineDash([]);
};

export default drawBorders;