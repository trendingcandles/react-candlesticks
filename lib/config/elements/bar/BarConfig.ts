/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface BarConfigComplete {
  width: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface BarConfig {
  width?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export type BarTheme = BarConfigComplete;

export const barDefaults: BarConfigComplete = {
  width: 0.6,
  backgroundColor: '#777',
  borderColor: '#777',
  borderWidth: 0,
};
