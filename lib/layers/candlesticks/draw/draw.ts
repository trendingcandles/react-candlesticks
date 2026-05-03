/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../config/chart/ChartConfig';
import { Layout } from '../../../domain/types/Layout';
import drawCandlestick from './drawCandlestick';
import { ChartMetrics } from '../../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../../domain/types/metrics/LayerMetrics';
import { PanelConfigComplete } from '../../../config/panel/PanelConfig';
import drawDirectionalValueMarker from '../../../drawing/valueMarker/drawDirectionalValueMarker';
import { CandlestickLayerConfigComplete } from '../CandlestickLayerConfig';
import { LayerConfigComplete } from '../../../config/layer/LayerConfig';
import ViewportData from '../../../domain/types/ViewportData';

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

  const candlesticksLayerConfig: CandlestickLayerConfigComplete = layerConfig as CandlestickLayerConfigComplete;

  const {
    timeScale: {
      metadata: {
        scrollOffset,
        intervalSize,
      },
      startBarIndex,
      endBarIndex,
      getLastVisibleBarIndex,
    },
    dataMap: {
      ohlcvs: {
        open,
        high,
        low,
        close,
        timestamp,
      },
    },
  } = viewportData;

  const {
    markers,
    yAxis,
    valueLabelFormatter,
  } = candlesticksLayerConfig;
  const valueMarkerConfig = markers?.value;

  if (!chartMetrics) return;

  const { valueToY } = layerMetrics;

  let lastBarIndex = -1;
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    if (!isNaN(close[barIndex])) {
      const x = (barIndex * intervalSize) - scrollOffset;

      drawCandlestick(
        context,
        panelConfig,
        candlesticksLayerConfig,
        intervalSize,
        valueToY,
        open[barIndex],
        high[barIndex],
        low[barIndex],
        close[barIndex],
        x,
        timestamp[barIndex],
      );

      lastBarIndex = barIndex;
    }
  }

  if (valueMarkerConfig && lastBarIndex >= 0) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lastBarIndex);

    const lastOpenValue: number | undefined = open[valueMarkerBarIndex];
    const lastCloseValue: number | undefined = close[valueMarkerBarIndex];

    drawDirectionalValueMarker(
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
      lastCloseValue,
      lastCloseValue - lastOpenValue,
    );
  }
};

export default draw;
