/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ThemeComplete } from '../../domain/types/Theme';
import { ChartConfigComplete, ChartConfig, chartDefaults } from './ChartConfig';
import parseCrosshairsConfig from './crosshairs/parseCrosshairsConfig';
import parseGridConfig from './grid/parseGridConfig';
import parseBordersConfig from './borders/parseBordersConfig';
import parseXAxisConfig from './xAxis/parseXAxisConfig';
import parseWatermarkConfig from './watermark/parseWatermarkConfig';

const parseChartConfig = (partialConfig: ChartConfig, theme: ThemeComplete, defaultTimeZoneId: string): ChartConfigComplete => {
  return {
    backgroundColor: partialConfig?.backgroundColor ?? theme.chart.backgroundColor ?? chartDefaults.backgroundColor,
    borders: parseBordersConfig(partialConfig.borders, theme.chart.borders),
    xAxis: parseXAxisConfig(partialConfig.xAxis, theme.chart.xAxis, defaultTimeZoneId),
    grid: parseGridConfig(partialConfig.grid, theme.chart.grid),
    crosshairs: parseCrosshairsConfig(partialConfig.crosshairs, theme.chart.crosshairs),
    watermark: parseWatermarkConfig(partialConfig.watermark, theme.chart.watermark),
  }; 
};

export default parseChartConfig;
