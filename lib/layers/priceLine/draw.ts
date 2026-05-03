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
import startDrawLine from '../../drawing/elements/line/startDrawLine';
import drawLine from '../../drawing/elements/line/drawLine';
import endDrawLine from '../../drawing/elements/line/endDrawLine';
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import ViewportData from '../../domain/types/ViewportData';
import { PriceLineLayerConfigComplete } from './PriceLineLayerConfig';
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

  const priceLineLayerConfig: PriceLineLayerConfigComplete = layerConfig as PriceLineLayerConfigComplete;

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
  } = priceLineLayerConfig;

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

  const values = outputValues.price;

  const { valueToY } = layerMetrics;

  let lastX: number | undefined = undefined;
  let lastBarIndex = -1;
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    const priceValue = values[barIndex];

    if (!isNaN(priceValue)) {
      const x = (barIndex * intervalSize) - scrollOffset;

      if (lastX === undefined) {
        startDrawLine(
          context,
          valueToY,
          priceValue,
          x,
          valueLineConfig,
        );
      } else {
        drawLine(
          context,
          valueToY,
          priceValue,
          x,
        );
      }

      lastX = x;
      lastBarIndex = barIndex;
    }
  }

  if (lastX && lastBarIndex >= 0) {
    endDrawLine(
      context,
      valueToY,
      values[lastBarIndex],
      lastX,
      valueLineConfig,
      // lastBarIndex === lastBarIndexWithData,
    );
  }

  if (valueMarkerConfig && lastBarIndex >= 0) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lastBarIndex);

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
