/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../../config/chart/ChartConfig';
import { PanelConfigComplete } from '../../../config/panel/PanelConfig';
import { Layout } from '../../../domain/types/Layout';
import { LayerMetrics } from '../../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../../domain/types/metrics/PanelMetrics';
import granularityToTimeUnit from '../../../data/utils/granularityToTimeUnit';
import { PanelYAxes } from '../../panel/getPanelYAxes';
import drawChartValueCrosshairLabel from './drawChartValueCrosshairLabel';
import { LayerScale } from '../../../config/layer/BaseLayerConfig';
import DataPointInfo from '../../../domain/types/DataPointInfo';
import ViewportData from '../../../domain/types/ViewportData';

const getYToValue = (min: number, max: number, top: number, height: number) => {
  const range = max - min;
  return (y: number) => max - ((y - top) / height) * range;
};

const shouldDrawValueCrosshairLabel = (scale: LayerScale, value: number): boolean => {
  if (scale.range.type === 'positive' && value < 0) return false;
  if (scale.range.type === 'bounded' && (value < scale.range.min || value > scale.range.max)) return false;
  return true;
};

const drawChartCrosshairs = (
  crosshairsContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panels: PanelConfigComplete[],
  layout: Layout,
  metricsByPanel: Record<string, { panelMetrics: PanelMetrics; layerMetricsByScale: Record<LayerScale['key'], LayerMetrics>; }>,
  viewportData: ViewportData,
  clientX: number,
  clientY: number,
  onCrosshairsMove?: (timestamp: number | null, dataPoint: DataPointInfo | null) => void,
) => {

  const {
    crosshairs,
    xAxis,
  } = chartConfig;

  if (!crosshairs) return;

  const { value: valueCrosshair, time: timeCrosshair } = crosshairs;

  if (!valueCrosshair && !timeCrosshair) return null;

  const {
    drawingAreaX,
    drawingAreaX1,
    drawingAreaY,
    drawingAreaY1,
  } = layout;

  crosshairsContext.save();
  crosshairsContext.setTransform(1, 0, 0, 1, 0, 0);
  crosshairsContext.clearRect(0, 0, crosshairsContext.canvas.width, crosshairsContext.canvas.height);
  crosshairsContext.restore(); 

  const {
    indexProvider: {
      indexToTimestamp,
    },
    timeScale: {
      // sessionsAndBlocks: { blocks },
      metadata: {
        granularity,
      },
      xToIntervalX,
      xToBarIndex,
    },
    scrollOffset,
    xToDataPoint,
  } = viewportData;

  const { left, top } = crosshairsContext.canvas.getBoundingClientRect();

  const mousePointerX = clientX - left;
  const y = Math.round(clientY - top);

  if (mousePointerX < drawingAreaX || mousePointerX > drawingAreaX1 || y < drawingAreaY || y > drawingAreaY1) return;

  const yToValueFunctionByScale: Partial<Record<string, (y: number) => number>> = {};
  let panelYAxes: PanelYAxes | undefined;
  for (let panelIndex = 0; panelIndex < panels.length; panelIndex++) {
    const { id, paddingTop, paddingBottom, yAxes } = panels[panelIndex];
    const metrics = metricsByPanel[id];
    if (!metrics) {
      console.warn('Metrics not found for panel:', id);
      break;
    }
    const {
      panelMetrics: {
        topPx,
        heightPx,
      },
    } = metrics;
    if (y >= topPx && y < (topPx + heightPx)) {
      const { layerMetricsByScale } = metrics
      for (const scaleKey in layerMetricsByScale) {
        const layerMetrics = layerMetricsByScale[scaleKey];
        const { min, max } = layerMetrics;
        yToValueFunctionByScale[scaleKey] = getYToValue(min, max, topPx + paddingTop, heightPx - (paddingTop + paddingBottom));
      }
      panelYAxes = yAxes;
    }
  }

  if (Object.keys(yToValueFunctionByScale).length === 0 || !panelYAxes) return;

  const intervalX = xToIntervalX(mousePointerX - drawingAreaX, scrollOffset); // xToIntervalX used only here
  const barIndex = xToBarIndex(intervalX); // xToBarIndex used only here
  // const ts = indexToTimestamp(barIndex, blocks) ?? null;
  const ts = indexToTimestamp(barIndex) ?? null;

  const dpInfo = xToDataPoint(mousePointerX); // xToDataPoint used only here

  if (onCrosshairsMove && ts) {
    onCrosshairsMove(ts, dpInfo);
  }

  const xSharp = drawingAreaX + intervalX + 0.5;
  const ySharp = y + 0.5;

  // value line (horizontal)
  if (valueCrosshair && valueCrosshair.line) {
    const {
      color: valueLineColor,
      width: valueLineWidth,
      style: valueLineStyle,
      dashes: valueLineDashes,
    } = valueCrosshair.line
    crosshairsContext.strokeStyle = valueLineColor;
    crosshairsContext.lineWidth = valueLineWidth;
    if (valueLineStyle === 'dashed') {
      crosshairsContext.setLineDash(valueLineDashes!);
    }
    crosshairsContext.beginPath();
    crosshairsContext.moveTo(drawingAreaX, ySharp);
    crosshairsContext.lineTo(drawingAreaX1, ySharp);
    crosshairsContext.stroke();
    crosshairsContext.setLineDash([]);
  }

  // time line (vertical)
  if (timeCrosshair && timeCrosshair.line && xSharp >= drawingAreaX && xSharp <= drawingAreaX1) {
    const {
      color: timeLineColor,
      width: timeLineWidth,
      style: timeLineStyle,
      dashes: timeLineDashes,
    } = timeCrosshair.line
    crosshairsContext.strokeStyle = timeLineColor;
    crosshairsContext.lineWidth = timeLineWidth;
    if (timeLineStyle === 'dashed') {
      crosshairsContext.setLineDash(timeLineDashes!);
    }
    crosshairsContext.beginPath();
    crosshairsContext.moveTo(xSharp, drawingAreaY);
    crosshairsContext.lineTo(xSharp, drawingAreaY1);
    crosshairsContext.stroke();
    crosshairsContext.setLineDash([]);
  }

  // value label(s)
  if (valueCrosshair && valueCrosshair.label) {
    const { leftAxes, rightAxes } = panelYAxes;

    for (let i = 0; i < leftAxes.length; i++) {
      const leftYAxis = leftAxes[i];
      const value = yToValueFunctionByScale[leftYAxis.scale.key]!(y);
      if (!shouldDrawValueCrosshairLabel(leftYAxis.scale, value)) continue;
      drawChartValueCrosshairLabel(
        crosshairsContext,
        layout,
        valueCrosshair.label,
        leftYAxis,
        ySharp,
        value,
      );
    }

    for (let i = 0; i < rightAxes.length; i++) {
      const rightYAxis = rightAxes[i];
      const value = yToValueFunctionByScale[rightYAxis.scale.key]!(y);
      if (!shouldDrawValueCrosshairLabel(rightYAxis.scale, value)) continue;
      drawChartValueCrosshairLabel(
        crosshairsContext,
        layout,
        valueCrosshair.label,
        rightYAxis,
        ySharp,
        value,
      );
    }
  }

  // time label
  if (timeCrosshair && timeCrosshair.label && xSharp >= drawingAreaX && xSharp <= drawingAreaX1 && ts) {
    const {
      hPadding: timeLabelHPadding,
      vPadding: timeLabelVPadding,
      backgroundColor: timeLabelFillColor,
      color: timeLabelColor,
      fontSize: timeLabelFontSize,
      fontFamily: timeLabelFontFamily,
      fontWeight: timeLabelFontWeight,
      fontStyle: timeLabelFontStyle,
      formatter: timeLabelFormatter,
    } = timeCrosshair.label;

    const timeText = timeLabelFormatter({
      utcTs: ts,
      timeUnit: granularityToTimeUnit(granularity),
      timeZoneId: xAxis?.timeZoneId,
    });
    const timeTextWidth = Math.round(crosshairsContext.measureText(timeText).width);
    const bgWidth = timeTextWidth + timeLabelHPadding * 2;
    const bgHeight = timeLabelFontSize + timeLabelVPadding * 2;

    crosshairsContext.fillStyle = timeLabelFillColor;
    crosshairsContext.fillRect(xSharp - Math.round(bgWidth / 2), drawingAreaY1, bgWidth, bgHeight);

    crosshairsContext.fillStyle = timeLabelColor;
    crosshairsContext.font = `${timeLabelFontWeight} ${timeLabelFontStyle} ${timeLabelFontSize}px ${timeLabelFontFamily}`;
    crosshairsContext.textAlign = 'center';
    crosshairsContext.textBaseline = 'middle';
    crosshairsContext.fillText(`${timeText}`, xSharp, drawingAreaY1 + bgHeight / 2);
  }

};

export default drawChartCrosshairs;
