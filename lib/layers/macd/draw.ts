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
import { MacdLayerConfigComplete } from './MacdLayerConfig';
import drawBar from '../../drawing/elements/drawBar';
import drawLineSeries from '../../drawing/series/drawLineSeries';
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
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {

  const macdLayerConfig: MacdLayerConfigComplete = layerConfig as MacdLayerConfigComplete;

  if (!chartMetrics || !panelMetrics || !layerMetrics) return;

  const {
    id,
    series: {
      macd: macdLineConfig,
      signal: signalLineConfig,
      histogramUp: upBarConfig,
      histogramDown: downBarConfig,
    },
    markers: {
      macd: macdValueMarkerConfig,
      signal: signalValueMarkerConfig,
    },
    yAxis,
    valueLabelFormatter,
  } = macdLayerConfig;

  if (!macdLineConfig && !signalLineConfig && !upBarConfig && !downBarConfig) return;

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

  const macdValues = outputValues['macd'];
  const signalValues = outputValues['signal'];
  const histogramValues = outputValues['histogram'];

  const { valueToY } = layerMetrics;

  const macdLineResult = macdLineConfig
    ? drawLineSeries({
        context,
        values: macdValues,
        lineConfig: macdLineConfig,
        valueToY,
        startBarIndex,
        endBarIndex,
        intervalSize,
        scrollOffset,
      })
    : null;

  const signalLineResult = signalLineConfig
    ? drawLineSeries({
        context,
        values: signalValues,
        lineConfig: signalLineConfig,
        valueToY,
        startBarIndex,
        endBarIndex,
        intervalSize,
        scrollOffset,
      })
    : null;

  // Draw Histogram as bars (green)
  if (upBarConfig && downBarConfig) {
    
     for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const histValue = histogramValues[barIndex];

      if (!isNaN(histValue)) {
        const x = (barIndex * intervalSize) - scrollOffset;
        
        // Calculate bar dimensions
        const widthRatio = histValue >= 0 ? upBarConfig.width : downBarConfig.width;
        const barWidth = Math.max(1, Math.round(intervalSize * widthRatio)); // At least 1px wide
        const barX = x - (barWidth / 2);
        
        // Draw bar from zero line
        if (histValue >= 0) {
          drawBar(
            context,
            valueToY,
            histValue,
            0,
            barX,
            barWidth,
            upBarConfig,
          );
        } else {
          drawBar(
            context,
            valueToY,
            histValue,
            0,
            barX,
            barWidth,
            downBarConfig,
          );
        }
      }
    }
  }

  if (signalValueMarkerConfig && signalLineResult) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(signalLineResult.lastBarIndex);

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
      signalValueMarkerConfig,
      macdValues[valueMarkerBarIndex],
    );
  }
  // display MACD active value label on top
  if (macdValueMarkerConfig && macdLineResult) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(macdLineResult.lastBarIndex);

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
      macdValueMarkerConfig,
      macdValues[valueMarkerBarIndex],
    );
  }

};

export default draw;
