/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ChartConfigComplete } from '../chart/ChartConfig';
import { PanelConfigComplete } from '../panel/PanelConfig';
import { DataPoint } from '../../domain/types/DataPoint';
import { Layout } from '../../domain/types/Layout';
import { ChartMetrics } from '../../domain/types/metrics/ChartMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerConfig, LayerConfigComplete, LayersTheme } from './LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import ViewportData from '../../domain/types/ViewportData';

interface Layer {

  parseConfig: (config: LayerConfig, layersTheme: LayersTheme, panelId: string) => LayerConfigComplete;

  calculate?: ((
    data: DataPoint[],
    config: LayerConfigComplete,
  ) => DataPoint[]) | null;

  calculate2?: ((
    layerConfig: LayerConfigComplete,
    inputs: Record<string, LayerInputSeries>,
    outputValues: Record<string, Float64Array>,
    startBarIndex: number,
    endBarIndex: number,
  ) => void) | null;

  draw?: (
    context: CanvasRenderingContext2D,
    axesContext: CanvasRenderingContext2D,
    chartConfig: ChartConfigComplete,
    panelConfig: PanelConfigComplete,
    layerConfig: LayerConfigComplete,
    layout: Layout,
    viewportData: ViewportData,
    chartMetrics: ChartMetrics | null,
    panelMetrics: PanelMetrics,
    layerMetrics: LayerMetrics,
  ) => void;
  
}

export default Layer;
