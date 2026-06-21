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
import drawDirectionalValueMarker from '../../drawing/valueMarker/drawDirectionalValueMarker';
import ViewportData from '../../domain/types/ViewportData';
import { OhlcBarsLayerConfigComplete } from './OhlcBarsLayerConfig';

const getVariantKey = (open: number, close: number): 'up' | 'down' | 'flat' => {
  if (close > open) return 'up';
  if (close < open) return 'down';
  return 'flat';
};

const drawOhlcBar = (
  context: CanvasRenderingContext2D,
  layerConfig: OhlcBarsLayerConfigComplete,
  intervalSize: number,
  valueToY: (value: number) => number,
  open: number,
  high: number,
  low: number,
  close: number,
  x: number,
) => {
  const barsConfig = layerConfig.series.bars;
  if (!barsConfig) return;

  const variantConfig = barsConfig[getVariantKey(open, close)];
  const tickWidth = Math.max(3, Math.round(intervalSize * variantConfig.width));
  const halfTickWidth = tickWidth / 2;
  const strokeWidth = Math.max(1, variantConfig.borderWidth);
  const color = variantConfig.borderColor || variantConfig.backgroundColor;

  context.save();
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.beginPath();
  context.moveTo(x, valueToY(high));
  context.lineTo(x, valueToY(low));
  context.moveTo(x - halfTickWidth, valueToY(open));
  context.lineTo(x, valueToY(open));
  context.moveTo(x, valueToY(close));
  context.lineTo(x + halfTickWidth, valueToY(close));
  context.stroke();
  context.restore();
};

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: OhlcBarsLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
) => {
  if (!chartMetrics) return;

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
      },
    },
  } = viewportData;

  const { valueToY } = layerMetrics;

  let lastBarIndex = -1;
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    if (!Number.isFinite(close[barIndex])) continue;

    const x = (barIndex * intervalSize) - scrollOffset;
    drawOhlcBar(
      context,
      layerConfig,
      intervalSize,
      valueToY,
      open[barIndex],
      high[barIndex],
      low[barIndex],
      close[barIndex],
      x,
    );

    lastBarIndex = barIndex;
  }

  const valueMarkerConfig = layerConfig.markers?.value;
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
      layerConfig.yAxis,
      layerConfig.valueLabelFormatter,
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
