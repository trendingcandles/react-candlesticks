/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawLineSeries from '../../drawing/series/drawLineSeries';
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import { BollingerBandsLayerConfigComplete } from './BollingerBandsLayerConfig';

const draw = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: BollingerBandsLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics | null,
  layerMetrics: LayerMetrics | null,
) => {

  const bbLayerConfig = layerConfig;

  if (!chartMetrics || !panelMetrics || !layerMetrics) return;

  const {
    id,
    offset,
    series: {
      upper: upperLineConfig,
      middle: midLineConfig,
      lower: lowerLineConfig,
    },
    bands: {
      channel: channelBandConfig,
    },
    markers: {
      value: valueMarkerConfig,
    },
    yAxis,
    valueLabelFormatter,
  } = bbLayerConfig;

  if (!upperLineConfig && !midLineConfig && !lowerLineConfig) return;

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

  const middleValues = outputValues.middle ?? outputValues.mid;
  const lowerValues = outputValues.lower;
  const upperValues = outputValues.upper;

  if (!middleValues || !lowerValues || !upperValues) return;

  const { valueToY } = layerMetrics;

  context.save();

  // Fill the bands area first (so lines draw on top)
  if (channelBandConfig) {
    context.beginPath();
    context.fillStyle = channelBandConfig.fillColor;
    
    // Create path for upper band
    let hasPoints = false;
    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const upperValue = upperValues[barIndex];
      if (!isNaN(upperValue)) {
        const x = ((barIndex + offset) * intervalSize) - scrollOffset;
        const y = valueToY(upperValue);
        
        if (!hasPoints) {
          context.moveTo(x, y);
          hasPoints = true;
        } else {
          context.lineTo(x, y);
        }
      }
    }
    
    // Continue path backwards along lower band
    for (let barIndex = endBarIndex; barIndex >= startBarIndex; barIndex--) {
      const lowerValue = lowerValues[barIndex];
      if (!isNaN(lowerValue)) {
        const x = ((barIndex + offset) * intervalSize) - scrollOffset;
        const y = valueToY(lowerValue);
        context.lineTo(x, y);
      }
    }
    
    context.closePath();
    context.fill();
  }

  // Draw Upper Band (red/orange)
  if (upperLineConfig) {
    drawLineSeries({
      context,
      values: upperValues,
      lineConfig: upperLineConfig,
      valueToY,
      startBarIndex,
      endBarIndex,
      intervalSize,
      scrollOffset,
      barOffset: offset,
    });
  }

  // Draw Lower Band (red/orange)
  if (lowerLineConfig) {
    drawLineSeries({
      context,
      values: lowerValues,
      lineConfig: lowerLineConfig,
      valueToY,
      startBarIndex,
      endBarIndex,
      intervalSize,
      scrollOffset,
      barOffset: offset,
    });
  }

  // Draw Middle Band (blue) - this is the SMA
  const middleLineResult = midLineConfig
    ? drawLineSeries({
        context,
        values: middleValues,
        lineConfig: midLineConfig,
        valueToY,
        startBarIndex,
        endBarIndex,
        intervalSize,
        scrollOffset,
        barOffset: offset,
      })
    : null;

  // Restore canvas state
  context.restore();

  if (valueMarkerConfig && middleLineResult) {
    const valueMarkerBarIndex = getLastVisibleBarIndex(middleLineResult.lastBarIndex);

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
      middleValues[valueMarkerBarIndex],
    );
  }

};

export default draw;
