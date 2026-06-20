/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawPanelBorder from './drawPanelBorder';
import { TimeScale } from '../../domain/types/TimeScale';
import drawLayersForScale from './drawLayersForScale';
import { LayerScale } from '../../config/layer//BaseLayerConfig';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import mapLayerByScale from './mapLayersByScale';
import ViewportData from '../../domain/types/ViewportData';
import { DrawingRegistry } from '../../config/drawing/DrawingRegistry';
import drawDrawings from '../drawing/drawDrawings';
import { ScaleSmoothingRuntime } from './drawLayersForScale';

const drawPanel = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layout: Layout,
  timeScale: TimeScale,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelIndex: number,
  drawingRegistry?: DrawingRegistry,
  scaleSmoothingRuntime?: ScaleSmoothingRuntime,
): { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; } | undefined => {

  const {
    id,
    layers: layerConfigs,
  } = panelConfig;

  if (!chartMetrics) {
    throw new Error(`No chart metrics found for panel: ${id}`);
  }

  const panelMetrics = chartMetrics.getPanelMetrics(id);

  if (!panelMetrics) {
    throw new Error(`No panel metrics found for panel: ${id}`);
  }

  if (layerConfigs.length === 0) {
    console.warn(`Panel ${id} has no layers`);
    return;
  }

  const { layersData: { layersTopology: { deducedLayerScales }} } = viewportData;

  const layersByScale = mapLayerByScale(layerConfigs, deducedLayerScales);

  const layerMetricsByScale = {} as Record<LayerScale['key'], LayerMetrics>;

  for (const scaleKey in layersByScale) {
    const layers = layersByScale[scaleKey];
    const layer0 = layers[0];
    if (layer0) {
      const decudedLayerScale = deducedLayerScales[layer0.id];
      const layerMetrics = drawLayersForScale(
        context,
        axesContext,
        chartConfig,
        panelConfig,
        layout,
        timeScale,
        viewportData,
        chartMetrics,
        panelMetrics,
        panelIndex,
        decudedLayerScale,
        layers,
        scaleSmoothingRuntime,
      );
      if (layerMetrics) {
        layerMetricsByScale[scaleKey] = layerMetrics;
      }
    }
  }

  if (panelIndex >= 1) {
    drawPanelBorder(
      context,
      axesContext,
      chartConfig,
      panelConfig,
      layerConfigs,
      layout,
      viewportData,
      chartMetrics,
      panelMetrics,
    );
  }

  drawDrawings(
    context,
    axesContext,
    chartConfig,
    panelConfig,
    layout,
    viewportData,
    chartMetrics,
    panelMetrics,
    layerMetricsByScale,
    drawingRegistry,
  );

  return {
    panelMetrics,
    layerMetricsByScale,
  };

};

export default drawPanel;
