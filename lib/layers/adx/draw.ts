/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawLine from '../../drawing/elements/line/drawLine';
import endDrawLine from '../../drawing/elements/line/endDrawLine';
import startDrawLine from '../../drawing/elements/line/startDrawLine';
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import { AdxLayerConfigComplete } from './AdxLayerConfig';

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
  const adxLayerConfig = layerConfig as AdxLayerConfigComplete;
  if (!chartMetrics || !panelMetrics || !layerMetrics) return;

  const { id, series, markers, yAxis, valueLabelFormatter } = adxLayerConfig;
  const layerDataInstance = viewportData.layersData.layerDataInstances[id];
  if (!layerDataInstance) return;

  const {
    timeScale: {
      metadata: { intervalSize, scrollOffset },
      startBarIndex,
      endBarIndex,
      getLastVisibleBarIndex,
    },
  } = viewportData;
  const { valueToY } = layerMetrics;
  const lineConfig = series.value;
  const values = layerDataInstance.outputValues.value;
  let lastBarIndex = -1;
  let lastX: number | undefined;

  if (lineConfig) {
    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const value = values[barIndex];
      if (Number.isNaN(value)) continue;

      const x = (barIndex * intervalSize) - scrollOffset;
      if (lastX === undefined) {
        startDrawLine(context, valueToY, value, x, lineConfig);
      } else {
        drawLine(context, valueToY, value, x);
      }

      lastX = x;
      lastBarIndex = barIndex;
    }

    if (lastX !== undefined && lastBarIndex >= 0) {
      endDrawLine(context, valueToY, values[lastBarIndex], lastX, lineConfig);
    }
  }

  if (markers.value && lastBarIndex >= 0) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lastBarIndex);
    drawValueMarker(
      context,
      axesContext,
      layout,
      chartConfig,
      panelConfig,
      adxLayerConfig,
      yAxis,
      valueLabelFormatter,
      chartMetrics,
      panelMetrics,
      layerMetrics,
      viewportData,
      markers.value,
      values[valueMarkerBarIndex],
    );
  }
};

export default draw;
