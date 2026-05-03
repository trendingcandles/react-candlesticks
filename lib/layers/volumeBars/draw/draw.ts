/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../../config/panel/PanelConfig';
import { Layout } from '../../../domain/types/Layout';
import { ChartMetrics } from '../../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../../domain/types/metrics/PanelMetrics';
import drawVolumeBar from './drawVolumeBar';
import { LayerMetrics } from '../../../domain/types/metrics/LayerMetrics';
import drawValueMarker from '../../../drawing/valueMarker/drawValueMarker';
import { VolumeBarsLayerConfigComplete } from '../VolumeBarsLayerConfig';
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
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {

  const volumeBarsLayerConfig: VolumeBarsLayerConfigComplete = layerConfig as VolumeBarsLayerConfigComplete;

  const {
    timeScale: {
      metadata: { intervalSize, scrollOffset },
      startBarIndex,
      endBarIndex,
      getLastVisibleBarIndex,
    },
    dataMap: {
      ohlcvs: {
        open,
        close,
        volume,
      }
    },
  } = viewportData;

  const {
    markers,
    series,
    yAxis,
    valueLabelFormatter,
  } = volumeBarsLayerConfig;
  const valueMarkerConfig = markers?.value;
  const bars = series.bars;

  if (!bars) return;

  if (!chartMetrics || !panelMetrics || !layerMetrics) return;

  const {
    paddedBottomPx
  } = panelMetrics;

  const { valueToY } = layerMetrics;

  let lastBarIndex = -1;
  for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
    const openValue = open[barIndex];
    const closeValue = close[barIndex];
    const volumeValue = volume[barIndex];

    if (!isNaN(volumeValue)) {
      const x = (barIndex * intervalSize) - scrollOffset;

      let variantKey: 'up' | 'down' | 'flat';
      if (closeValue > openValue) variantKey = 'up';
      else if (closeValue < openValue) variantKey = 'down';
      else variantKey = 'flat';

      const y = valueToY(volumeValue);

      drawVolumeBar(
        context,
        volumeBarsLayerConfig,
        variantKey,
        x,
        y,
        paddedBottomPx,
        intervalSize,
      );

      lastBarIndex = barIndex;
    }
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
      volume[valueMarkerBarIndex],
    );
  }
};

export default draw;
