/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DrawingPointer } from '../../config/drawing/Drawing';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';

const getYToValue = (
  min: number,
  max: number,
  top: number,
  height: number,
) => {
  const range = max - min;
  return (y: number) => max - ((y - top) / height) * range;
};

interface CreateDrawingPointerParams {
  clientX: number;
  clientY: number;
  chartX: number;
  chartY: number;
  panelX: number;
  panelY: number;
  panelMetrics: PanelMetrics;
  layerMetrics?: LayerMetrics;
  viewportData?: ViewportData;
}

const createDrawingPointer = ({
  clientX,
  clientY,
  chartX,
  chartY,
  panelX,
  panelY,
  panelMetrics,
  layerMetrics,
  viewportData,
}: CreateDrawingPointerParams): DrawingPointer => {
  const {
    intervalSize = 1,
    scrollOffset = 0,
  } = viewportData?.timeScale.metadata ?? {};
  const index = (panelX + scrollOffset) / intervalSize;
  const barIndex = viewportData?.timeScale.xToBarIndex(panelX);
  const timestamp = barIndex === undefined
    ? undefined
    : viewportData?.indexProvider.indexToTimestamp(barIndex);
  const value = layerMetrics
    ? getYToValue(
      layerMetrics.min,
      layerMetrics.max,
      panelMetrics.paddedTopPx,
      panelMetrics.paddedHeightPx,
    )(chartY)
    : undefined;

  return {
    clientX,
    clientY,
    chartX,
    chartY,
    panelX,
    panelY,
    index,
    barIndex,
    timestamp,
    value,
  };
};

export default createDrawingPointer;
