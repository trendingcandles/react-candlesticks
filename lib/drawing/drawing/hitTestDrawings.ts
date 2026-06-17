/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { DrawingHit, DrawingHitTestContext, DrawingPointer } from '../../config/drawing/Drawing';
import { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import createDrawingContext from './createDrawingContext';

export interface DrawingHitResult {
  hit: DrawingHit;
  context: DrawingHitTestContext;
}

export type MetricsByPanel = Record<string, {
  panelMetrics: PanelMetrics;
  layerMetricsByScale: Record<string, LayerMetrics>;
}>;

const getYToValue = (
  min: number,
  max: number,
  top: number,
  height: number,
) => {
  const range = max - min;
  return (y: number) => max - ((y - top) / height) * range;
};

const createPointer = (
  clientX: number,
  clientY: number,
  chartX: number,
  chartY: number,
  panelX: number,
  panelY: number,
  panelMetrics: PanelMetrics,
  layerMetrics?: LayerMetrics,
  viewportData?: ViewportData,
): DrawingPointer => {
  const barIndex = viewportData?.timeScale.xToBarIndex(panelX);
  const timestamp = barIndex === undefined
    ? undefined
    : viewportData?.indexProvider.indexToTimestamp(barIndex);
  const value = layerMetrics
    ? getYToValue(
      layerMetrics.min,
      layerMetrics.max,
      panelMetrics.paddedTopPx,
      panelMetrics.paddedHeightPx,
    )(chartY)
    : undefined;

  return {
    clientX,
    clientY,
    chartX,
    chartY,
    panelX,
    panelY,
    barIndex,
    timestamp,
    value,
  };
};

const hitTestDrawings = (
  clientX: number,
  clientY: number,
  chartX: number,
  chartY: number,
  chartConfig: ChartConfigComplete,
  panels: PanelConfigComplete[],
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  metricsByPanel: MetricsByPanel,
  drawingRegistry: DrawingRegistry = {},
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
): DrawingHitResult | null => {
  if (
    chartX < layout.drawingAreaX ||
    chartX > layout.drawingAreaX1 ||
    chartY < layout.drawingAreaY ||
    chartY > layout.drawingAreaY1
  ) {
    return null;
  }

  const panelX = chartX - layout.drawingAreaX;

  for (let panelIndex = panels.length - 1; panelIndex >= 0; panelIndex--) {
    const panelConfig = panels[panelIndex];
    const metrics = metricsByPanel[panelConfig.id];
    if (!metrics) continue;

    const { panelMetrics, layerMetricsByScale } = metrics;
    if (chartY < panelMetrics.topPx || chartY > panelMetrics.bottomPx) continue;

    const drawings = panelConfig.drawings ?? [];

    for (let drawingIndex = drawings.length - 1; drawingIndex >= 0; drawingIndex--) {
      const drawingConfig = drawings[drawingIndex];
      if (drawingConfig.visible === false) continue;

      const drawing = drawingRegistry[drawingConfig.type];
      if (!drawing?.hitTest) continue;

      const drawingContext = createDrawingContext({
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
      });
      const hitTestContext: DrawingHitTestContext = {
        ...drawingContext,
        pointer: createPointer(
          clientX,
          clientY,
          chartX,
          chartY,
          panelX,
          chartY - panelMetrics.topPx,
          panelMetrics,
          drawingContext.layerMetrics,
          viewportData,
        ),
      };
      const hit = drawing.hitTest(hitTestContext);

      if (hit) {
        return {
          hit: {
            ...hit,
            drawingId: drawingConfig.id,
            drawingType: drawingConfig.type,
            panelId: panelConfig.id,
          },
          context: hitTestContext,
        };
      }
    }
  }

  return null;
};

export default hitTestDrawings;
