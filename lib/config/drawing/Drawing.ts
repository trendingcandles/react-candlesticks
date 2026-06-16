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
import { PanelMetrics } from '../../domain/types/metrics/PanelMetrics';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';
import ViewportData from '../../domain/types/ViewportData';
import { DrawingConfig, DrawingConfigComplete } from './DrawingConfig';

export interface DrawingRenderContext<C extends DrawingConfigComplete = DrawingConfigComplete> {
  context: CanvasRenderingContext2D;
  axesContext: CanvasRenderingContext2D;
  chartConfig: ChartConfigComplete;
  panelConfig: PanelConfigComplete;
  drawingConfig: C;
  layout: Layout;
  viewportData: ViewportData;
  chartMetrics: ChartMetrics;
  panelMetrics: PanelMetrics;
  layerMetricsByScale: Record<string, LayerMetrics>;
  scaleKey?: string;
  layerMetrics?: LayerMetrics;
  xForIndex: (index: number) => number;
  xForTimestamp: (timestamp: number, nearest?: boolean) => number | undefined;
  valueToY: (value: number, scaleKey?: string) => number | undefined;
}

export type DrawingDraw<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(renderContext: DrawingRenderContext<C>): void;
}['bivarianceHack'];

export type DrawingParseConfig<
  C extends DrawingConfig = DrawingConfig,
  Complete extends DrawingConfigComplete = DrawingConfigComplete,
> = {
  bivarianceHack(config: C, panelId: string, drawingIndex: number): Complete;
}['bivarianceHack'];

interface Drawing<
  C extends DrawingConfig = DrawingConfig,
  Complete extends DrawingConfigComplete = DrawingConfigComplete,
> {
  parseConfig?: DrawingParseConfig<C, Complete>;
  draw: DrawingDraw<Complete>;
}

export default Drawing;
