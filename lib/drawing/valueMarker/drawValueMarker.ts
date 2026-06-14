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
import drawValueMarkerLabel from './drawValueMarkerLabel';
import drawValueMarkerLine from './drawValueMarkerLine';
import { ValueMarkerConfigComplete } from '../../config/valueMarker/ValueMarkerConfig';
import ViewportData from '../../domain/types/ViewportData';
import { YAxisConfigComplete } from '../../config/layer/yAxis/YAxisConfig';
import { PanelConfigComplete } from '../../config/panel/PanelConfig';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';

const drawValueMarker = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  layout: Layout,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: BaseLayerConfigComplete,
  yAxisConfig: YAxisConfigComplete | null,
  valueLabelFormatter: (value: number) => string,
  chartMatrics: ChartMetrics,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
  viewportData: ViewportData,
  valueMarkerConfig: ValueMarkerConfigComplete,
  value?: number,
) => {

  if (!chartMatrics || !layerMetrics) return;

  const {
    mode,
    line,
    label,
  } = valueMarkerConfig;
   
  if (line) {
    drawValueMarkerLine(
      axesContext,
      layout,
      line,
      mode,
      chartMatrics,
      panelMetrics,
      layerMetrics,
      viewportData,
      value,
    );
  }

  if (label && yAxisConfig) {
    drawValueMarkerLabel(
      axesContext,
      layout,
      chartConfig,
      panelConfig,
      layerConfig,
      yAxisConfig,
      valueLabelFormatter,
      label,
      mode,
      chartMatrics,
      panelMetrics,
      layerMetrics,
      viewportData,
      value,
    );
  }

};

export default drawValueMarker;
