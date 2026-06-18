/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import { LayerHitTestContext } from '../../config/layer/Layer';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import ViewportData from '../../domain/types/ViewportData';
import createDrawingPointer from '../drawing/createDrawingPointer';

interface CreateLayerHitTestContextParams<C extends BaseLayerConfigComplete = BaseLayerConfigComplete> {
  clientX: number;
  clientY: number;
  chartX: number;
  chartY: number;
  panelX: number;
  panelY: number;
  chartConfig: ChartConfigComplete;
  panelConfig: PanelConfigComplete;
  layerConfig: C;
  layout: Layout;
  viewportData: ViewportData;
  panelMetrics: PanelMetrics;
  layerMetrics: LayerMetrics;
}

const createLayerHitTestContext = <C extends BaseLayerConfigComplete = BaseLayerConfigComplete>({
  clientX,
  clientY,
  chartX,
  chartY,
  panelX,
  panelY,
  chartConfig,
  panelConfig,
  layerConfig,
  layout,
  viewportData,
  panelMetrics,
  layerMetrics,
}: CreateLayerHitTestContextParams<C>): LayerHitTestContext<C> => {
  const {
    intervalSize,
    scrollOffset,
  } = viewportData.timeScale.metadata;

  return {
    chartConfig,
    panelConfig,
    layerConfig,
    layout,
    viewportData,
    panelMetrics,
    layerMetrics,
    pointer: createDrawingPointer({
      clientX,
      clientY,
      chartX,
      chartY,
      panelX,
      panelY,
      panelMetrics,
      layerMetrics,
      viewportData,
    }),
    xForIndex: (index: number) => index * intervalSize - scrollOffset,
    valueToY: (value: number) => layerMetrics.valueToY(value),
  };
};

export default createLayerHitTestContext;
