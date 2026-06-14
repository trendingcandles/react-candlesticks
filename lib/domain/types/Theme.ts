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

export interface Theme {
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
