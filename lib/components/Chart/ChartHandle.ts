/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export type ChartViewportChangeSource = 'user' | 'api' | 'data' | 'layout';
export type ChartViewportCallbackMode = 'animationFrame' | 'debounce' | 'none' | 'sync';

export interface ChartCallbackInfo {
  source: ChartViewportChangeSource;
}

export interface ChartViewport {
  scrollOffset: number;
  intervalWidthPx: number;
  startBarIndex: number;
  endBarIndex: number;
  source: ChartViewportChangeSource;
}

export type ChartRangeValue = number | string | Date;

export interface ChartVisibleRange {
  from: ChartRangeValue;
  to: ChartRangeValue;
  type?: 'barIndex' | 'timestamp';
  marginBars?: number;
}

export interface ChartCrosshairPosition {
  barIndex?: number;
  timestamp?: number | string | Date;
  value?: number;
  panelId?: string;
  scaleKey?: string;
  x?: number;
  y?: number;
}

export interface ChartCrosshairOptions {
  lock?: boolean;
}

export interface ChartMarginOptions {
  marginBars?: number;
}

export interface ChartHandle {
  setVisibleRange: (range: ChartVisibleRange) => void;
  setScrollPosition: (scrollOffset: number) => void;
  fitContent: (options?: ChartMarginOptions) => void;
  scrollToLatest: (options?: ChartMarginOptions) => void;
  setCrosshairPosition: (position: ChartCrosshairPosition, options?: ChartCrosshairOptions) => void;
  clearCrosshairPosition: () => void;
  getViewport: () => ChartViewport | null;
}
