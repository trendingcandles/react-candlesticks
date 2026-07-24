/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import {
  themeDefaultWatermark,
  WatermarkConfig,
  WatermarkConfigComplete,
  WatermarkTheme,
} from './WatermarkConfig';

const parseWatermarkConfig = (
  partialConfig: false | true | WatermarkConfig = false,
  watermarkTheme: WatermarkTheme = themeDefaultWatermark,
): null | WatermarkConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const config = partialConfig === true ? {} : partialConfig;

  return {
    color: config.color ?? watermarkTheme.color ?? themeDefaultWatermark.color,
    opacity: config.opacity ?? watermarkTheme.opacity ?? themeDefaultWatermark.opacity,
    width: config.width ?? watermarkTheme.width ?? themeDefaultWatermark.width,
    height: config.height ?? watermarkTheme.height ?? themeDefaultWatermark.height,
    paddingLeft: config.paddingLeft ?? watermarkTheme.paddingLeft ?? themeDefaultWatermark.paddingLeft,
    paddingBottom: config.paddingBottom ?? watermarkTheme.paddingBottom ?? themeDefaultWatermark.paddingBottom,
  };
};

export default parseWatermarkConfig;

