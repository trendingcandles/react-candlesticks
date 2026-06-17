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

export interface DrawingPointer {
  clientX: number;
  clientY: number;
  chartX: number;
  chartY: number;
  panelX: number;
  panelY: number;
  index?: number;
  barIndex?: number;
  timestamp?: number;
  value?: number;
}

export interface DrawingHit {
  drawingId: string;
  drawingType: string;
  panelId: string;
  target?: string;
  cursor?: string;
  data?: unknown;
}

export type DrawingHitTestResult =
  Omit<DrawingHit, 'drawingId' | 'drawingType' | 'panelId'> &
  Partial<Pick<DrawingHit, 'drawingId' | 'drawingType' | 'panelId'>>;

export interface DrawingRenderContext<C extends DrawingConfigComplete = DrawingConfigComplete> {
  context: CanvasRenderingContext2D;
  axesContext: CanvasRenderingContext2D;
  chartConfig: ChartConfigComplete;
  panelConfig: PanelConfigComplete;
  drawingConfig: C;
  layout: Layout;
  viewportData: ViewportData;
  chartMetrics: ChartMetrics | null;
  panelMetrics: PanelMetrics;
  layerMetricsByScale: Record<string, LayerMetrics>;
  scaleKey?: string;
  layerMetrics?: LayerMetrics;
  xForIndex: (index: number) => number;
  xForTimestamp: (timestamp: number, nearest?: boolean) => number | undefined;
  valueToY: (value: number, scaleKey?: string) => number | undefined;
}

export interface DrawingHitTestContext<C extends DrawingConfigComplete = DrawingConfigComplete> extends DrawingRenderContext<C> {
  pointer: DrawingPointer;
}

export interface DrawingPointerDelta {
  clientX: number;
  clientY: number;
  chartX: number;
  chartY: number;
  panelX: number;
  panelY: number;
  index?: number;
  barIndex?: number;
  timestamp?: number;
  value?: number;
}

export interface DrawingDragContext<C extends DrawingConfigComplete = DrawingConfigComplete> extends DrawingHitTestContext<C> {
  hit: DrawingHit;
  start: DrawingHitTestContext<C>;
  delta: DrawingPointerDelta;
}

export type DrawingDraw<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(renderContext: DrawingRenderContext<C>): void;
}['bivarianceHack'];

export type DrawingHitTest<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(hitTestContext: DrawingHitTestContext<C>): DrawingHitTestResult | null;
}['bivarianceHack'];

export type DrawingHoverHandler<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(hit: DrawingHit | null, hitTestContext: DrawingHitTestContext<C>): void;
}['bivarianceHack'];

export type DrawingClickHandler<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(hit: DrawingHit, hitTestContext: DrawingHitTestContext<C>): void;
}['bivarianceHack'];

export type DrawingDragStartHandler<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(hit: DrawingHit, hitTestContext: DrawingHitTestContext<C>): void;
}['bivarianceHack'];

export type DrawingDragHandler<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(dragContext: DrawingDragContext<C>): void;
}['bivarianceHack'];

export type DrawingDragEndHandler<C extends DrawingConfigComplete = DrawingConfigComplete> = {
  bivarianceHack(hit: DrawingHit, hitTestContext: DrawingHitTestContext<C>): void;
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
  hitTest?: DrawingHitTest<Complete>;
  onHover?: DrawingHoverHandler<Complete>;
  onClick?: DrawingClickHandler<Complete>;
  onDragStart?: DrawingDragStartHandler<Complete>;
  onDrag?: DrawingDragHandler<Complete>;
  onDragEnd?: DrawingDragEndHandler<Complete>;
}

export default Drawing;
