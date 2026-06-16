/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';

const drawDrawings = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  layerMetricsByScale: Record<string, LayerMetrics>,
  drawingRegistry: DrawingRegistry = {},
) => {
  const drawings = panelConfig.drawings ?? [];

  if (drawings.length === 0) return;

  const defaultScaleKey = Object.keys(layerMetricsByScale)[0];
  const {
    intervalSize,
    scrollOffset,
  } = viewportData.timeScale.metadata;

  context.save();
  context.beginPath();
  context.rect(0, panelMetrics.topPx, layout.drawingAreaWidth, panelMetrics.heightPx);
  context.clip();

  for (const drawingConfig of drawings) {
    if (drawingConfig.visible === false) continue;

    const drawing = drawingRegistry[drawingConfig.type];
    if (!drawing) continue;

    const scaleKey = drawingConfig.scaleKey && layerMetricsByScale[drawingConfig.scaleKey]
      ? drawingConfig.scaleKey
      : defaultScaleKey;
    const layerMetrics = scaleKey ? layerMetricsByScale[scaleKey] : undefined;

    drawing.draw({
      context,
      axesContext,
      chartConfig,
      panelConfig,
      drawingConfig,
      layout,
      viewportData,
      chartMetrics,
      panelMetrics,
      layerMetricsByScale,
      scaleKey,
      layerMetrics,
      xForIndex: (index: number) => index * intervalSize - scrollOffset,
      xForTimestamp: (timestamp: number, nearest = true) => {
        const index = viewportData.timeScale.timestampToIndex(timestamp, nearest);
        return index === undefined ? undefined : index * intervalSize - scrollOffset;
      },
      valueToY: (value: number, requestedScaleKey = scaleKey) =>
        requestedScaleKey ? layerMetricsByScale[requestedScaleKey]?.valueToY(value) : undefined,
    });
  }

  context.restore();
};

export default drawDrawings;
