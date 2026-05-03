/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface LineConfigComplete {
  color: string;
  style: 'solid' | 'dashed';
  width: number;
  dashes?: number[];
  endDotSize?: number;
}

export interface LineConfig {
  color?: string;
  style?: 'solid' | 'dashed';
  width?: number;
  dashes?: number[];
  endDotSize?: number;
}

export type LineTheme = LineConfigComplete;

export const lineDefaults = {
  color: '#1a1a1a',
  style: 'solid' as const,
  width: 1,
  dashes: [5, 5],
  endDotSize: 0,
};
