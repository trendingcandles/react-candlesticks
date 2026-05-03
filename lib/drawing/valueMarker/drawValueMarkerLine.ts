/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { Layout } from '../../domain/types/Layout';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { ValueMarkerMode } from '../../config/valueMarker/ValueMarkerMode';
import { LineConfigComplete } from '../../config/elements/line/LineConfig';
import ViewportData from '../../domain/types/ViewportData';

const drawValueMarkerLine = (
  axesContext: CanvasRenderingContext2D,
  layout: Layout,
  valueMarkerLineConfig: LineConfigComplete,
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
    color,
    width,
    style,
    dashes,
  } = valueMarkerLineConfig;

  const value = valueMarker;

  if (value === undefined) return;

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

  axesContext.lineWidth = width;
  axesContext.strokeStyle = color;

  if (style === 'dashed' && dashes) {
    axesContext.setLineDash(dashes);
  }

  axesContext.beginPath();
  axesContext.moveTo(drawingAreaX, y + 0.5);
  axesContext.lineTo(drawingAreaX1, y + 0.5);
  axesContext.stroke()

  axesContext.setLineDash([]);

};

export default drawValueMarkerLine;
