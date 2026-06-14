/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { TimeScale } from '../../domain/types/TimeScale';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';
import drawLayer from './drawLayer';
import ViewportData from '../../domain/types/ViewportData';

const drawLayers = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layers: BaseLayerConfigComplete[],
  layout: Layout,
  timeScale: TimeScale,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
) => {

  for (let index = 0; index < layers.length; index++)  {
    const layerConfig = layers[index];

    drawLayer(
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

export default drawLayers;
