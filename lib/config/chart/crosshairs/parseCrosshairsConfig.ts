/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { CrosshairsConfigComplete, CrosshairsConfig, CrosshairsTheme } from './CrosshairsConfig';
import parseTimeCrosshairConfig from './timeCrosshair/parseTimeCrosshairConfig';
import parseValueCrosshairConfig from './valueCrosshair/parseValueCrosshairConfig';

const parseCrosshairsConfig = (partialConfig: false | CrosshairsConfig = {}, crosshairsTheme: CrosshairsTheme): null | CrosshairsConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const crosshairsComplete: CrosshairsConfigComplete = {
    value: parseValueCrosshairConfig(partialConfig.value, crosshairsTheme.value),
    time: parseTimeCrosshairConfig(partialConfig.time, crosshairsTheme.time),
  };

  return crosshairsComplete;
};

export default parseCrosshairsConfig;
