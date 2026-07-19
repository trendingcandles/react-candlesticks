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

const isOddPixelWidth = (width: number): boolean => Math.round(width) % 2 === 1;

const snapStrokeCoordinate = (coordinate: number, strokeWidth: number): number => (
  Math.round(coordinate) + (isOddPixelWidth(strokeWidth) ? 0.5 : 0)
);

const alignTickWidth = (width: number, strokeWidth: number): number => {
  let tickWidth = Math.max(3, Math.round(width));

  if (isOddPixelWidth(tickWidth) !== isOddPixelWidth(strokeWidth)) {
    tickWidth += 1;
  }

  return tickWidth;
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
  const strokeWidth = Math.max(1, variantConfig.borderWidth);
  const tickWidth = alignTickWidth(intervalSize * variantConfig.width, strokeWidth);
  const halfTickWidth = tickWidth / 2;
  const color = variantConfig.borderColor || variantConfig.backgroundColor;
  const xPx = snapStrokeCoordinate(x, strokeWidth);
  const openY = snapStrokeCoordinate(valueToY(open), strokeWidth);
  const highY = snapStrokeCoordinate(valueToY(high), strokeWidth);
  const lowY = snapStrokeCoordinate(valueToY(low), strokeWidth);
  const closeY = snapStrokeCoordinate(valueToY(close), strokeWidth);

  context.save();
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.beginPath();
  context.moveTo(xPx, highY);
  context.lineTo(xPx, lowY);
  context.moveTo(xPx - halfTickWidth, openY);
  context.lineTo(xPx, openY);
  context.moveTo(xPx, closeY);
  context.lineTo(xPx + halfTickWidth, closeY);
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
