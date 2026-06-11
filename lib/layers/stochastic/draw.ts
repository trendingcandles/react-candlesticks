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
import { StochasticLayerConfigComplete } from './StochasticLayerConfig';
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import ViewportData from '../../domain/types/ViewportData';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: BaseLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {

  const stochasticLayerConfig: StochasticLayerConfigComplete = layerConfig as StochasticLayerConfigComplete;

  if (!chartMetrics || !panelMetrics || !layerMetrics) return;

  const {
    id,
    series,
    markers,
    yAxis,
    valueLabelFormatter,
  } = stochasticLayerConfig;
  const kLineConfig = series.k;
  const dLineConfig = series.d;
  const kValueMarkerConfig = markers?.k;
  const dValueMarkerConfig = markers?.d;

  if (!kLineConfig && !dLineConfig) return;

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

  const kSmoothedValues = outputValues['kSmoothed'];
  const dValues = outputValues['d'];

  const { valueToY } = layerMetrics;

  const dLineResult = dLineConfig
    ? drawLineSeries({
        context,
        values: dValues,
        lineConfig: dLineConfig,
        valueToY,
        startBarIndex,
        endBarIndex,
        intervalSize,
        scrollOffset,
      })
    : null;

  const kLineResult = kLineConfig
    ? drawLineSeries({
        context,
        values: kSmoothedValues,
        lineConfig: kLineConfig,
        valueToY,
        startBarIndex,
        endBarIndex,
        intervalSize,
        scrollOffset,
      })
    : null;

  if (dValueMarkerConfig && dLineResult) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(dLineResult.lastBarIndex);

    drawValueMarker(
      context,
      axesContext,
      layout,
      chartConfig,
      panelConfig,
      stochasticLayerConfig,
      yAxis,
      valueLabelFormatter,
      chartMetrics,
      panelMetrics,
      layerMetrics,
      viewportData,
      dValueMarkerConfig,
      dValues[valueMarkerBarIndex],
    );
  }
  if (kValueMarkerConfig && kLineResult) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(kLineResult.lastBarIndex);

    drawValueMarker(
      context,
      axesContext,
      layout,
      chartConfig,
      panelConfig,
      stochasticLayerConfig,
      yAxis,
      valueLabelFormatter,
      chartMetrics,
      panelMetrics,
      layerMetrics,
      viewportData,
      kValueMarkerConfig,
      kSmoothedValues[valueMarkerBarIndex],
    );
  }

};

export default draw;
