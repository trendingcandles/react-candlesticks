/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BordersConfig, BordersConfigComplete } from './borders/BordersConfig';
import { CrosshairsConfig, CrosshairsConfigComplete } from './crosshairs/CrosshairsConfig';
import { GridConfig, GridConfigComplete } from './grid/GridConfig';
import { XAxisConfig, XAxisConfigComplete } from './xAxis/XAxisConfig';

export interface ChartConfigComplete {
  backgroundColor: string;
  borders: null | BordersConfigComplete;
  xAxis: null | XAxisConfigComplete;
  grid: null | GridConfigComplete;
  crosshairs: null | CrosshairsConfigComplete;
}

export interface ChartConfig {
  backgroundColor?: string;
  borders?: false | BordersConfig;
  xAxis?: false | XAxisConfig;
  grid?: false | GridConfig;
  crosshairs?: false | CrosshairsConfig;
}

export const chartDefaults: Pick<ChartConfigComplete, 'backgroundColor'> = {
  backgroundColor: 'transparent',
};
