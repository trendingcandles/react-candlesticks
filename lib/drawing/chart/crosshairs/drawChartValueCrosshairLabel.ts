/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ValueCrosshairLabelConfigComplete } from '../../../config/chart/crosshairs/valueCrosshair/valueCrosshairLabel/ValueCrosshairLabelConfig';
import { Layout } from '../../../domain/types/Layout';
import { PanelYAxis } from '../../panel/getPanelYAxes';

const drawChartValueCrosshairLabel = (
  crosshairsContext: CanvasRenderingContext2D,
  layout: Layout,
  crosshairLabelConfig: ValueCrosshairLabelConfigComplete,
  panelYAxis: PanelYAxis,
  y: number,
  value: number,
) => {

  const {
    drawingAreaX,
    drawingAreaX1,
  } = layout;

  const {
    backgroundColor,
    color,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    hPadding,
    vPadding,
  } = crosshairLabelConfig;

  const {
    side,
    offsetPx,
    width,
  } = panelYAxis;

  const x = side === 'left' ? ((drawingAreaX - offsetPx) - width) : (drawingAreaX1 + offsetPx);

  const formattedValue = panelYAxis.labelFormatter(value);
  const valueTextWidth = Math.round(crosshairsContext.measureText(formattedValue).width);
  const bgWidth = valueTextWidth + hPadding * 2;
  const bgHeight = fontSize + vPadding * 2;

  crosshairsContext.fillStyle = backgroundColor;
  crosshairsContext.fillRect(x, y - bgHeight / 2, bgWidth, bgHeight);

  crosshairsContext.fillStyle = color;
  crosshairsContext.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
  crosshairsContext.textAlign = 'left';
  crosshairsContext.textBaseline = 'middle';
  crosshairsContext.fillText(formattedValue, x + hPadding, y);

};

export default drawChartValueCrosshairLabel;
