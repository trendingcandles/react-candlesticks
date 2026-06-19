/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { DrawingConfigComplete } from '../../config/drawing/DrawingConfig';
import { DrawingRenderContext } from '../../config/drawing/Drawing';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';

export interface CreateDrawingContextParams<C extends DrawingConfigComplete = DrawingConfigComplete> {
  context: CanvasRenderingContext2D;
  axesContext: CanvasRenderingContext2D;
  chartConfig: ChartConfigComplete;
  panelConfig: PanelConfigComplete;
  drawingConfig: C;
  layout: Layout;
  viewportData: ViewportData;
  chartMetrics: ChartMetrics | null;
  panelMetrics: PanelMetrics;
  layerMetricsByScale: Record<string, LayerMetrics>;
}

const createDrawingContext = <C extends DrawingConfigComplete = DrawingConfigComplete>({
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
}: CreateDrawingContextParams<C>): DrawingRenderContext<C> => {
  const defaultScaleKey = Object.keys(layerMetricsByScale)[0];
  const {
    intervalSize,
    scrollOffset,
  } = viewportData.timeScale.metadata;
  const scaleKey = drawingConfig.scaleKey && layerMetricsByScale[drawingConfig.scaleKey]
    ? drawingConfig.scaleKey
    : defaultScaleKey;
  const layerMetrics = scaleKey ? layerMetricsByScale[scaleKey] : undefined;

  return {
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
  };
};

export default createDrawingContext;
