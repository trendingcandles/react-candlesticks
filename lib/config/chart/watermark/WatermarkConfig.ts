/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface WatermarkConfigComplete {
  color: string;
  opacity: number;
  width: number;
  height: number;
  paddingLeft: number;
  paddingBottom: number;
}

export type WatermarkConfig = Partial<WatermarkConfigComplete>;

export type WatermarkTheme = WatermarkConfigComplete;

export const themeDefaultWatermark: WatermarkTheme = {
  color: 'white',
  opacity: 0.1,
  width: 60,
  height: 46,
  paddingLeft: 16,
  paddingBottom: 16,
};
