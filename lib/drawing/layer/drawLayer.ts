/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import layers from '../../layers/layers';
import ViewportData from '../../domain/types/ViewportData';

const drawLayer = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: BaseLayerConfigComplete,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
) => {

  const {
    type,
  } = layerConfig;

  const layer = viewportData.layersData?.layerRegistry?.[type] ?? layers[type];

  if (layer?.draw) {
    layer.draw(
      context,
      axesContext,
      chartConfig,
      panelConfig,
      layerConfig,
      layout,
      viewportData,
      chartMetrics,
      panelMetrics,
      layerMetrics,
    );
  }

};

export default drawLayer;
