/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { ValueMarkerMode } from '../../config/valueMarker/ValueMarkerMode';
import { BoxedValueLabelConfigComplete } from '../../config/elements/boxedValueLabel/BoxedValueLabelConfig';
import ViewportData from '../../domain/types/ViewportData';
import { YAxisConfigComplete } from '../../config/layer/yAxis/YAxisConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { LayerConfigComplete } from '../../config/layer/LayerConfig';

const drawValueMarkerLabel = (
  axesContext: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: LayerConfigComplete,
  yAxisConfig: YAxisConfigComplete,
  valueLabelFormatter: (value: number) => string,
  valueMarkerLabelConfig: BoxedValueLabelConfigComplete,
  mode: ValueMarkerMode,
  chartMatrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
  viewportData: ViewportData,
  valueMarker?: number,
) => {

  if (!chartMatrics || !panelMetrics || !layerMetrics) return;

  const {
    drawingAreaX,
    drawingAreaX1,
  } = layout;

  const {
    backgroundColor,
    borderColor,
    color,
    borderWidth,
    fontFamily,
    fontSize,
    fontWeight,
    fontVariant,
    fontStyle,
    hPadding,
    vPadding,
  } = valueMarkerLabelConfig;
  
  const value = valueMarker;

  if (value === undefined) return;

  const { layersData: {layersTopology: { deducedLayerScales } }} = viewportData;

  const scale = deducedLayerScales[layerConfig.id];
  const { key: scaleKey } = scale;

  const { yAxes: { axesByScale } } = panelConfig;

  const yAxisMetrics = axesByScale[scaleKey]!;

  const {
    paddedTopPx,
    paddedBottomPx,
  } = panelMetrics;

  const {
    valueToY,
  } = layerMetrics;

  let y = Math.round(valueToY(value));

  if (mode === 'last-data') {
    if (y < paddedTopPx) {
      y = paddedTopPx;
    } else if (y > paddedBottomPx) {
      y = paddedBottomPx;
    }
  }

  const {
    side,
    width,
  } = yAxisConfig;

  const { offsetPx } = yAxisMetrics;

  const labelX = side === 'left' ? ((drawingAreaX - offsetPx) - width) : (drawingAreaX1 + offsetPx);

  axesContext.lineWidth = 1;
  axesContext.strokeStyle = borderColor;
  axesContext.fillStyle = backgroundColor;

  const labelText = valueLabelFormatter(value);
  const labelWidth = Math.round(axesContext.measureText(labelText).width + hPadding * 2);
  const labelHeight = fontSize + vPadding * 2;
  const labelHalfHeight = Math.round(labelHeight / 2);
  const yLabelTopLeft = y - labelHalfHeight;

  if (borderWidth > 0) {
    // Draw border
    axesContext.fillStyle = borderColor;
    axesContext.fillRect(labelX, yLabelTopLeft, labelWidth, labelHeight);
    // Draw rectangle bg
    axesContext.fillStyle = backgroundColor;
    axesContext.fillRect(labelX + borderWidth, yLabelTopLeft + borderWidth, labelWidth - borderWidth * 2, labelHeight - borderWidth * 2);
  } else {
    // Draw rectangle bg
    axesContext.fillStyle = backgroundColor;
    axesContext.fillRect(labelX, yLabelTopLeft, labelWidth, labelHeight);
  }

  // Draw the price label text
  axesContext.textBaseline = 'middle';
  axesContext.textAlign = 'left';
  axesContext.fillStyle = color;
  axesContext.font =`${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;
  axesContext.fillText(labelText, labelX + hPadding, y);

};

export default drawValueMarkerLabel;
