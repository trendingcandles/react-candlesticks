/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DirectionalLineConfig, DirectionalLineConfigComplete, directionalLineDefaults, DirectionalLineTheme } from './DirectionalLineConfig';
import parseLineConfig from './parseLineConfig';

const parseDirectionalLineConfig = (
  partialConfig: false | DirectionalLineConfig = {},
  directionLineTheme?: DirectionalLineTheme,
): null | DirectionalLineConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  return {
    up: parseLineConfig(
      partialConfig.up,
      directionLineTheme?.up ?? directionalLineDefaults.up,
    )!,
    down: parseLineConfig(
      partialConfig.down,
      directionLineTheme?.down ?? directionalLineDefaults.down,
    )!,
    flat: parseLineConfig(
      partialConfig.flat,
      directionLineTheme?.flat ?? directionalLineDefaults.flat,
    )!,
  };
};

export default parseDirectionalLineConfig;
