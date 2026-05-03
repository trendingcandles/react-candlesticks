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
import drawLine from '../../drawing/elements/line/drawLine';
import { EmaLayerConfigComplete } from './EmaLayerConfig';
import endDrawLine from '../../drawing/elements/line/endDrawLine';
import startDrawLine from '../../drawing/elements/line/startDrawLine';
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
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
) => {

  const emaLayerConfig: EmaLayerConfigComplete = layerConfig as EmaLayerConfigComplete;

  if (!chartMetrics) return;

  const {
    id,
    offset,
    series: {
      value: valueLineConfig,
    },
    markers: {
      value: valueMarkerConfig,
    },
    yAxis,
    valueLabelFormatter,
  } = emaLayerConfig;

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

  let lastX: number | undefined = undefined;
  let lastBarIndex = -1;
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    const indicatorValue = values[barIndex];

    if (!isNaN(indicatorValue)) {
      const x = ((barIndex + offset) * intervalSize) - scrollOffset;

      if (lastX === undefined) {
        startDrawLine(
          context,
          valueToY,
          indicatorValue,
          x,
          valueLineConfig,
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
