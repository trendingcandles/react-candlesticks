/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { LineConfigComplete } from '../../config/elements/line/LineConfig';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { ValueMarkerConfigComplete } from '../../config/valueMarker/ValueMarkerConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import drawLineSeries from '../series/drawLineSeries';
import drawValueMarker from '../valueMarker/drawValueMarker';

export interface LineIndicatorSeries {
  output: string;
  line: null | LineConfigComplete;
  marker: null | ValueMarkerConfigComplete;
  barOffset?: number;
}

const drawLineIndicator = (
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
  series: LineIndicatorSeries[],
) => {
  if (!chartMetrics || !panelMetrics || !layerMetrics) return;
  if (series.every(item => !item.line)) return;

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

  for (const item of series) {
    if (!item.line) continue;
    const values = layerDataInstance.outputValues[item.output];
    const lineResult = drawLineSeries({
      context,
      values,
      lineConfig: item.line,
      valueToY: layerMetrics.valueToY,
      startBarIndex,
      endBarIndex,
      intervalSize,
      scrollOffset,
      ...(item.barOffset === undefined ? {} : { barOffset: item.barOffset }),
    });

    if (item.marker && lineResult) {
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
        item.marker,
        values[valueMarkerBarIndex],
      );
    }
  }
};

export default drawLineIndicator;
