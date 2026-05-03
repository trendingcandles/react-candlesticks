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
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import startDrawLine from '../../drawing/elements/line/startDrawLine';
import drawLine from '../../drawing/elements/line/drawLine';
import endDrawLine from '../../drawing/elements/line/endDrawLine';
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

  let lastMacdBarIndex = -1;
  if (macdLineConfig) {
    let lastX: number | undefined = undefined;
    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const indicatorValue = macdValues[barIndex];

      if (!isNaN(indicatorValue)) {
        const x = (barIndex * intervalSize) - scrollOffset;

        if (lastX === undefined) {
          startDrawLine(
            context,
            valueToY,
            indicatorValue,
            x,
            macdLineConfig,
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
        lastMacdBarIndex = barIndex;
      }
    }

    if (lastX && lastMacdBarIndex >= 0) {
      endDrawLine(
        context,
        valueToY,
        macdValues[lastMacdBarIndex],
        lastX,
        macdLineConfig,
      );
    }
  }

  let lastSignalBarIndex = -1;
  if (signalLineConfig) {
    let lastX: number | undefined = undefined;
    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const indicatorValue = signalValues[barIndex];

      if (!isNaN(indicatorValue)) {
        const x = (barIndex * intervalSize) - scrollOffset;

        if (lastX === undefined) {
          startDrawLine(
            context,
            valueToY,
            indicatorValue,
            x,
            signalLineConfig,
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
        lastSignalBarIndex = barIndex;
      }
    }

    if (lastX && lastSignalBarIndex >= 0) {
      endDrawLine(
        context,
        valueToY,
        signalValues[lastSignalBarIndex],
        lastX,
        signalLineConfig,
      );
    }
  }

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

  if (signalValueMarkerConfig && lastSignalBarIndex >= 0) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lastSignalBarIndex);

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
  if (macdValueMarkerConfig && lastMacdBarIndex >= 0) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(lastMacdBarIndex);

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
