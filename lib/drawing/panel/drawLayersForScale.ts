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
import calculateValueGridLines from '../chart/grid/value/calculateValueGridLines';
import drawValueGridLines from '../chart/grid/value/drawValueGridLines';
import { TimeScale } from '../../domain/types/TimeScale';
import drawLayers from '../layer/drawLayers';
import calculateLayerMetrics from '../../metrics/layer/calculateLayerMetrics';
import { BaseLayerConfigComplete, LayerScale } from '../../config/layer/BaseLayerConfig';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import drawValueGridLabels from '../elements/labels/valueLabel/drawValueGridLabels';
import ViewportData from '../../domain/types/ViewportData';
import smoothLayerMetrics, { ScaleSmoothingState } from '../../metrics/layer/smoothLayerMetrics';
import { ScaleSmoothingConfigComplete } from '../../config/chart/scaleSmoothing/ScaleSmoothingConfig';

export interface ScaleSmoothingRuntime {
  config: ScaleSmoothingConfigComplete;
  state: ScaleSmoothingState;
  now: number;
  shouldContinue: boolean;
}

const drawLayersForScale = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layout: Layout,
  timeScale2: TimeScale,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  panelIndex: number,
  scale: LayerScale,
  layerConfigs: BaseLayerConfigComplete[],
  scaleSmoothingRuntime?: ScaleSmoothingRuntime,
): LayerMetrics | undefined => {

  const {
    id: panelId,
    yAxes: {
      axesByScale,
    },
  } = panelConfig;

  const panelYAxis = axesByScale[scale.key]!;

  const layerConfig0 = layerConfigs[0];

  const {
    valueGridLines: explictGridLines,
  } = layerConfig0;

  const {
    topPx,
    heightPx,
  } = panelMetrics;

  const { dataMap, layersData, timeScale: { startBarIndex, endBarIndex } } = viewportData;

  const targetLayerMetrics = calculateLayerMetrics(
    dataMap,
    layersData,
    startBarIndex,
    endBarIndex,
    layerConfigs,
    layerConfig0,
    panelMetrics,
    scale,
  );

  if (!targetLayerMetrics) {
    console.warn(`Layer metrics could not be calculated for panel ${panelId}. Check data length and that value range is greater than zero.`);
    return;
  }

  const { paddedHeightPx, paddedTopPx } = panelMetrics;
  const { valueToY: getValueToY } = layerConfig0;

  const smoothingResult = scaleSmoothingRuntime
    ? smoothLayerMetrics({
        state: scaleSmoothingRuntime.state,
        stateKey: `${panelId}:${scale.key}`,
        targetMetrics: targetLayerMetrics,
        config: scaleSmoothingRuntime.config,
        valueToY: getValueToY,
        top: paddedTopPx,
        height: paddedHeightPx,
        now: scaleSmoothingRuntime.now,
      })
    : { metrics: targetLayerMetrics, settled: true };

  if (!smoothingResult.settled && scaleSmoothingRuntime) {
    scaleSmoothingRuntime.shouldContinue = true;
  }

  const layerMetrics = smoothingResult.metrics;

  const {
    min,
    max,
    valueToY,
  } = layerMetrics;

  const valueLines = calculateValueGridLines(
    min,
    max,
    valueToY,
    Math.ceil((panelConfig.heightRatio / chartMetrics.totalPanelsHeightUnits) * 9), // todo: maxGridLines as config option
    explictGridLines,
  );

  context.save();
  context.beginPath();
  context.rect(0, topPx, context.canvas.width, heightPx);
  context.clip();

  drawValueGridLines(
    context,
    layout,
    chartConfig,
    panelConfig,
    valueLines, // todo: const values from config or calculated based on panel size or max lines
    panelMetrics,
  );

  drawValueGridLabels(
    axesContext,
    layout,
    chartConfig,
    panelConfig,
    layerConfig0,
    valueLines,
    panelMetrics,
    panelYAxis,
  );

  drawLayers(
    context,
    axesContext,
    chartConfig,
    panelConfig,
    layerConfigs,
    layout,
    timeScale2,
    viewportData,
    chartMetrics,
    panelMetrics,
    layerMetrics,
  );

  context.restore();

  return layerMetrics;

};

export default drawLayersForScale;
