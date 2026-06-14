/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../../config/chart/ChartConfig';
import { Layout } from '../../domain/types/Layout';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { ValueMarkerConfigComplete } from '../../config/valueMarker/ValueMarkerConfig';
import { DirectionalValueMarkerConfigComplete } from '../../config/valueMarker/DirectionalValueMarkerConfig';
import drawValueMarker from './drawValueMarker';
import ViewportData from '../../domain/types/ViewportData';
import { YAxisConfigComplete } from '../../config/layer/yAxis/YAxisConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';

const drawDirectionalValueMarker = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: BaseLayerConfigComplete,
  yAxisConfig: YAxisConfigComplete | null,
  valueLabelFormatter: (value: number) => string,
  chartMetrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
  viewportData: ViewportData,
  directionalValueMarker: DirectionalValueMarkerConfigComplete,
  valueMarker?: number,
  direction: number = 0,
) => {

  if (!chartMetrics || !layerMetrics) return;

  const {
    mode,
    showLine,
    showLabel,
    up,
    down,
    flat,
  } = directionalValueMarker;

  if (!showLine && !showLabel) return;
  
  let valueMarkerConfig: Omit<ValueMarkerConfigComplete, 'mode'>;
  if (direction > 0) valueMarkerConfig = up;
  else if (direction < 0) valueMarkerConfig = down;
  else valueMarkerConfig = flat

  drawValueMarker(
    context,
    axesContext,
    layout,
    chartConfig,
    panelConfig,
    layerConfig,
    yAxisConfig,
    valueLabelFormatter,
    chartMetrics,
    panelMetrics,
    layerMetrics,
    viewportData,
    {
      ...valueMarkerConfig,
      mode,
    },
    valueMarker,
  );

};

export default drawDirectionalValueMarker;
