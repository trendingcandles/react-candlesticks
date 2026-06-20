/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { GridTheme } from '../../config/chart/grid/GridConfig';
import { CrosshairsTheme } from '../../config/chart/crosshairs/CrosshairsConfig';
import { PanelTheme } from '../../config/panel/PanelConfig';
import { LayersTheme } from '../../config/layer/LayersTheme';
import { BordersTheme } from '../../config/chart/borders/BordersConfig';
import { XAxisTheme } from '../../config/chart/xAxis/XAxisConfig';
import { LineTheme } from '../../config/elements/line/LineConfig';
import { ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer Item)[]
    ? DeepPartial<Item>[]
    : T extends object
      ? { [Key in keyof T]?: DeepPartial<T[Key]> }
      : T;

export interface IndicatorThemeInput {
  line?: DeepPartial<LineTheme>;
  marker?: DeepPartial<ValueMarkerTheme>;
  legend?: DeepPartial<LegendTheme>;
  yAxis?: DeepPartial<YAxisTheme>;
  linePalette?: string[];
  positiveColor?: string;
  negativeColor?: string;
  neutralColor?: string;
}

export interface ThemeComplete {
  chart: {
    backgroundColor: string;
    xAxis: XAxisTheme;
    borders: BordersTheme;
    grid: GridTheme;
    crosshairs: CrosshairsTheme;
  };
  panels: PanelTheme;
  layers: LayersTheme;
}

export type ThemeBase = 'light' | 'dark';

export type Theme = DeepPartial<ThemeComplete> & {
  base?: ThemeBase;
  indicators?: IndicatorThemeInput;
};
