/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import ViewportData from '../../domain/types/ViewportData';
import drawLineSeries from '../../drawing/series/drawLineSeries';
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import { AreaLayerConfigComplete } from './AreaLayerConfig';

const drawAreaFill = (
  context: CanvasRenderingContext2D,
  values: Float64Array,
  layerConfig: AreaLayerConfigComplete,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
  viewportData: ViewportData,
) => {
  const fillConfig = layerConfig.series.value.fill;
  if (!fillConfig) return;

  const {
    timeScale: {
      metadata: { intervalSize, scrollOffset },
      startBarIndex,
      endBarIndex,
    },
  } = viewportData;

  const bottomY = panelMetrics.bottomPx;
  let segmentStartX = 0;
  let lastX = 0;
  let hasOpenPath = false;

  const closePath = () => {
    if (!hasOpenPath) return;
    context.lineTo(lastX, bottomY);
    context.lineTo(segmentStartX, bottomY);
    context.closePath();
    context.fill();
    hasOpenPath = false;
  };

  context.save();
  const gradient = context.createLinearGradient(0, panelMetrics.topPx, 0, bottomY);
  gradient.addColorStop(0, fillConfig.topColor);
  gradient.addColorStop(1, fillConfig.bottomColor);
  context.fillStyle = gradient;

  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    const value = values[barIndex];
    if (!Number.isFinite(value)) {
      closePath();
      continue;
    }

    const x = (barIndex * intervalSize) - scrollOffset;
    const y = layerMetrics.valueToY(value);

    if (!hasOpenPath) {
      context.beginPath();
      context.moveTo(x, bottomY);
      context.lineTo(x, y);
      segmentStartX = x;
      hasOpenPath = true;
    } else {
      context.lineTo(x, y);
    }

    lastX = x;
  }

  closePath();
  context.restore();
};

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: AreaLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {
  if (!chartMetrics || !panelMetrics || !layerMetrics) return;

  const {
    id,
    yAxis,
    valueLabelFormatter,
  } = layerConfig;
  const {
    timeScale: {
      metadata: { intervalSize, scrollOffset },
      startBarIndex,
      endBarIndex,
      getLastVisibleBarIndex,
    },
    layersData: { layerDataInstances },
  } = viewportData;
  const layerDataInstance = layerDataInstances[id];
  if (!layerDataInstance) return;

  const values = layerDataInstance.outputValues.price;
  if (!values) return;

  drawAreaFill(context, values, layerConfig, panelMetrics, layerMetrics, viewportData);

  const lineConfig = layerConfig.series.value.line;
  if (!lineConfig) return;

  const lineResult = drawLineSeries({
    context,
    values,
    lineConfig,
    valueToY: layerMetrics.valueToY,
    startBarIndex,
    endBarIndex,
    intervalSize,
    scrollOffset,
  });

  const markerConfig = layerConfig.markers.value;
  if (markerConfig && lineResult) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lineResult.lastBarIndex);
    drawValueMarker(
      context,
      axesContext,
      layout,
      chartConfig,
      panelConfig,
      layerConfig,
      yAxis,
      valueLabelFormatter,
      chartMetrics,
      panelMetrics,
      layerMetrics,
      viewportData,
      markerConfig,
      values[valueMarkerBarIndex],
    );
  }
};

export default draw;
