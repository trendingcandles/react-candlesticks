/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../chart/ChartConfig';
import { PanelConfigComplete } from '../panel/PanelConfig';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { BaseLayerConfig, BaseLayerConfigComplete } from './BaseLayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import ViewportData from '../../domain/types/ViewportData';
import { LayersTheme } from './LayersTheme';

export type LayerCalculate<C extends BaseLayerConfigComplete = BaseLayerConfigComplete> = (
  layerConfig: C,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => void;

export type LayerDraw<C extends BaseLayerConfigComplete = BaseLayerConfigComplete> = (
  context: CanvasRenderingContext2D,
  axesContext: CanvasRenderingContext2D,
  chartConfig: ChartConfigComplete,
  panelConfig: PanelConfigComplete,
  layerConfig: C,
  layout: Layout,
  viewportData: ViewportData,
  chartMetrics: ChartMetrics | null,
  panelMetrics: PanelMetrics,
  layerMetrics: LayerMetrics,
) => void;

interface Layer<
  C extends BaseLayerConfig = BaseLayerConfig,
  Complete extends BaseLayerConfigComplete = BaseLayerConfigComplete,
> {

  parseConfig(config: C, layersTheme: LayersTheme, panelId: string): Complete;

  calculate?(
    layerConfig: Complete,
    inputs: Record<string, LayerInputSeries>,
    outputValues: Record<string, Float64Array>,
    startBarIndex: number,
    endBarIndex: number,
  ): void;

  draw?(
    context: CanvasRenderingContext2D,
    axesContext: CanvasRenderingContext2D,
    chartConfig: ChartConfigComplete,
    panelConfig: PanelConfigComplete,
    layerConfig: Complete,
    layout: Layout,
    viewportData: ViewportData,
    chartMetrics: ChartMetrics | null,
    panelMetrics: PanelMetrics,
    layerMetrics: LayerMetrics,
  ): void;
  
}

export default Layer;
