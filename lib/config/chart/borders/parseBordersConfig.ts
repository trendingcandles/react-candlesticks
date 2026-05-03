/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../elements/line/parseLineConfig';
import { BordersConfig, BordersConfigComplete, BordersTheme, themeDefaultBorders } from './BordersConfig';

const parseBordersConfig = (partialConfig: false | BordersConfig = {}, defaults?: BordersTheme, color?: string): null | BordersConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const effectiveDefaults = defaults ?? themeDefaultBorders;

  const bordersConfigComplete: BordersConfigComplete = {
    left: parseLineConfig(partialConfig.left, effectiveDefaults.left, color),
    right: parseLineConfig(partialConfig.right, effectiveDefaults.right, color),
    top: parseLineConfig(partialConfig.top, effectiveDefaults.top, color),
    bottom: parseLineConfig(partialConfig.bottom, effectiveDefaults.bottom, color),
  };

  return bordersConfigComplete;
};

export default parseBordersConfig;
