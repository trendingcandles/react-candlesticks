/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import drawValueMarker from '../../drawing/valueMarker/drawValueMarker';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import { BollingerBandsLayerConfigComplete } from './BollingerBandsLayerConfig';
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

  const bbLayerConfig: BollingerBandsLayerConfigComplete = layerConfig as BollingerBandsLayerConfigComplete;

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

  const drawBandLine = (bandKey: string, color: string, lineWidth: number, lineStyle: 'solid' | 'dashed', dashes?: number[]): number => {

    const values = outputValues[bandKey];

    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    if (lineStyle === 'dashed' && dashes) {
      context.setLineDash(dashes);
    }
    
    let pointsDrawn = 0;
    let firstPoint = true;

    let lastBarIndex = -1;
    for (let barIndex = startBarIndex; barIndex <= endBarIndex; barIndex++) {
      const indicatorValue = values[barIndex];

      if (!isNaN(indicatorValue)) {
        const x = ((barIndex + offset) * intervalSize) - scrollOffset;
        const y = valueToY(indicatorValue);

        if (firstPoint) {
          context.moveTo(x, y);
          firstPoint = false;
        } else {
          context.lineTo(x, y);
        }
        pointsDrawn++;
        lastBarIndex = barIndex;
      }
    }

    if (pointsDrawn > 0) {
      context.stroke();
    }
    context.setLineDash([]);

    return lastBarIndex;
  };

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

  let lastBarIndex = -1;

  // Draw Upper Band (red/orange)
  if (upperLineConfig) {
    const { color, width, style, dashes } = upperLineConfig;
    drawBandLine('upper', color, width, style, dashes);
  }

  // Draw Lower Band (red/orange)
  if (lowerLineConfig) {
    const { color, width, style, dashes } = lowerLineConfig;
    drawBandLine('lower', color, width, style, dashes);
  }

  // Draw Middle Band (blue) - this is the SMA
  if (midLineConfig) {
    const { color, width, style, dashes } = midLineConfig;
    lastBarIndex = drawBandLine('middle', color, width, style, dashes);
  }

  // Restore canvas state
  context.restore();

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
      middleValues[valueMarkerBarIndex],
    );
  }

};

export default draw;
