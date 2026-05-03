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
import drawLine from '../../drawing/elements/line/drawLine';
import { StochasticLayerConfigComplete } from './StochasticLayerConfig';
import startDrawLine from '../../drawing/elements/line/startDrawLine';
import endDrawLine from '../../drawing/elements/line/endDrawLine';
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

  let lastDBarIndex = -1;
  if (dLineConfig) {
    let lastX: number | undefined = undefined;
    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const indicatorValue = dValues[barIndex];

      if (!isNaN(indicatorValue)) {
        const x = (barIndex * intervalSize) - scrollOffset;

        if (lastX === undefined) {
          startDrawLine(
            context,
            valueToY,
            indicatorValue,
            x,
            dLineConfig,
          );
        } else {
          drawLine(
            context,
            valueToY,
            indicatorValue,
            x,
          );
        }

        lastX = x;
        lastDBarIndex = barIndex;
      }
    }

    if (lastX && lastDBarIndex >= 0) {
      endDrawLine(
        context,
        valueToY,
        dValues[lastDBarIndex],
        lastX,
        dLineConfig,
      );
    }
  }

  let lastKBarIndex = -1;
  if (kLineConfig) {
    let lastX: number | undefined = undefined;
    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const indicatorValue = kSmoothedValues[barIndex];

      if (!isNaN(indicatorValue)) {
        const x = (barIndex * intervalSize) - scrollOffset;

        if (lastX === undefined) {
          startDrawLine(
            context,
            valueToY,
            indicatorValue,
            x,
            kLineConfig,
          );
        } else {
          drawLine(
            context,
            valueToY,
            indicatorValue,
            x,
          );
        }

        lastX = x;
        lastKBarIndex = barIndex;
      }
    }

    if (lastX && lastKBarIndex >= 0) {
      endDrawLine(
        context,
        valueToY,
        kSmoothedValues[lastKBarIndex],
        lastX,
        kLineConfig,
      );
    }
  }

  if (dValueMarkerConfig && lastDBarIndex >= 0) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lastDBarIndex);

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
  if (kValueMarkerConfig && lastKBarIndex >= 0) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lastKBarIndex);

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
