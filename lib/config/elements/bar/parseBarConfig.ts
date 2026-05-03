/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BarConfig, BarConfigComplete, barDefaults } from './BarConfig';

const parseBarConfig = (partialConfig: false | BarConfig = {}, defaults: BarConfig = {}): null | BarConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  return {
    width: partialConfig.width ?? defaults.width ?? barDefaults.width,
    backgroundColor: partialConfig.backgroundColor ?? defaults.backgroundColor ?? barDefaults.backgroundColor,
    borderColor: partialConfig.borderColor ?? defaults.borderColor ?? barDefaults.borderColor,
    borderWidth: partialConfig.borderWidth ?? defaults.borderWidth ?? barDefaults.borderWidth,
  };
};

export default parseBarConfig;
