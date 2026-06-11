/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawLineSeries from '../../drawing/series/drawLineSeries';
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
  const lineConfig = series.value;
  const values = layerDataInstance.outputValues.value;

  const lineResult = lineConfig
    ? drawLineSeries({
        context,
        values,
        lineConfig,
        valueToY: layerMetrics.valueToY,
        startBarIndex,
        endBarIndex,
        intervalSize,
        scrollOffset,
      })
    : null;

  if (markers.value && lineResult) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lineResult.lastBarIndex);
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
