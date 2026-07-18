/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export { default as Chart } from './components/Chart';
export type {
  ChartCallbackInfo,
  ChartHandle,
  ChartProps,
  ChartPropsBase,
  ChartViewport,
  ChartViewportCallbackMode,
  PanelsAsChildrenChartProps,
  PanelsAsPropChartProps,
} from './components/Chart';
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
export type { BordersConfig, BordersConfigComplete } from './config/chart/borders/BordersConfig';
export type { CrosshairsConfig, CrosshairsConfigComplete } from './config/chart/crosshairs/CrosshairsConfig';
export type { GridConfig, GridConfigComplete } from './config/chart/grid/GridConfig';
export type { XAxisConfig, XAxisConfigComplete } from './config/chart/xAxis/XAxisConfig';
