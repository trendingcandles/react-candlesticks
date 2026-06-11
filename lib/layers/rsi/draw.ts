/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import drawLineSeries from '../../drawing/series/drawLineSeries';
import { RsiLayerConfigComplete } from './RsiLayerConfig';
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import ViewportData from '../../domain/types/ViewportData';
import { LayerConfigComplete } from '../../config/layer/LayerConfig';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: LayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {

  const rsiLayerConfig: RsiLayerConfigComplete = layerConfig as RsiLayerConfigComplete;

  if (!chartMetrics || !panelMetrics || !layerMetrics) return;

  const {
    id,
    series: {
      value: valueLineConfig,
    },
    markers: {
      value: valueMarkerConfig,
    },
    yAxis,
    valueLabelFormatter,
  } = rsiLayerConfig;

  if (!valueLineConfig) return;

  const {
    timeScale: {
      metadata: { intervalSize, scrollOffset },
      startBarIndex,
      endBarIndex,
      getLastVisibleBarIndex,
    },
    layersData: {
      layerDataInstances,
    },
  } = viewportData;

  const layerDataInstance = layerDataInstances[id];

  if (!layerDataInstance) return;

  const { outputValues } = layerDataInstance;

  const values = outputValues['value']

  const { valueToY } = layerMetrics;

  const lineResult = drawLineSeries({
    context,
    values,
    lineConfig: valueLineConfig,
    valueToY,
    startBarIndex,
    endBarIndex,
    intervalSize,
    scrollOffset,
  });

  if (valueMarkerConfig && lineResult) {
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
      valueMarkerConfig,
      values[valueMarkerBarIndex],
    );
  }

};

export default draw;
