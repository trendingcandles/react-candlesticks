/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../config/chart/ChartConfig';
import { Layout } from '../../../domain/types/Layout';

const LOGO_VIEWBOX_X = 12;
const LOGO_VIEWBOX_Y = 12;
const LOGO_VIEWBOX_WIDTH = 60;
const LOGO_VIEWBOX_HEIGHT = 46;

const drawLogoPath = (context: CanvasRenderingContext2D) => {
  context.beginPath();
  context.moveTo(58, 14);
  context.lineTo(50, 14);
  context.quadraticCurveTo(47, 14, 47, 17);
  context.lineTo(47, 29);
  context.quadraticCurveTo(47, 31, 45, 31);
  context.lineTo(36, 31);
  context.quadraticCurveTo(33, 31, 33, 34);
  context.lineTo(33, 42);
  context.quadraticCurveTo(33, 44, 31, 44);
  context.lineTo(22, 44);
  context.quadraticCurveTo(19, 44, 19, 47);
  context.lineTo(19, 64);
  context.quadraticCurveTo(19, 67, 22, 67);
  context.lineTo(30, 67);
  context.quadraticCurveTo(33, 67, 33, 64);
  context.lineTo(33, 63);
  context.quadraticCurveTo(33, 61, 35, 61);
  context.lineTo(44, 61);
  context.quadraticCurveTo(47, 61, 47, 58);
  context.lineTo(47, 57);
  context.quadraticCurveTo(47, 55, 49, 55);
  context.lineTo(58, 55);
  context.quadraticCurveTo(61, 55, 61, 52);
  context.lineTo(61, 17);
  context.quadraticCurveTo(61, 14, 58, 14);
  context.closePath();
};

const drawChartWatermark = (
  context: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
) => {
  const { watermark } = chartConfig;

  if (!watermark) return;

  const {
    color,
    opacity,
    width,
    height,
    paddingLeft,
    paddingBottom,
  } = watermark;

  const x = paddingLeft;
  const y = layout.drawingAreaY1 - paddingBottom - height;

  if (width <= 0 || height <= 0 || opacity <= 0 || y < layout.drawingAreaY) return;

  context.save();
  context.globalAlpha = Math.min(1, opacity);
  context.fillStyle = color;
  context.translate(x, y);
  context.scale(width / LOGO_VIEWBOX_WIDTH, height / LOGO_VIEWBOX_HEIGHT);
  context.translate(-LOGO_VIEWBOX_X, -LOGO_VIEWBOX_Y);
  context.translate(40, 40);
  context.rotate(Math.PI / 8);
  context.translate(-40, -40);
  context.translate(0, -6);
  drawLogoPath(context);
  context.fill();
  context.restore();
};

export default drawChartWatermark;

