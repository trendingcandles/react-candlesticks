/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export * from './components';
export * from './config';
export * from './layers';
export * from './drawings';
export * from './domain/types/DataPoint';
export * from './exampleData';
export type { IndicatorThemeInput, Theme, ThemeBase, ThemeComplete } from './domain/types/Theme';
export type { ThemeName } from './themes/themes';
export { default as resolveTheme } from './themes/resolveTheme';
export type {
  ScaleSmoothingConfig,
  ScaleSmoothingConfigComplete,
  ScaleSmoothingInput,
} from './config/chart/scaleSmoothing/ScaleSmoothingConfig';
export type {
  WatermarkConfig,
  WatermarkConfigComplete,
  WatermarkTheme,
} from './config/chart/watermark/WatermarkConfig';
