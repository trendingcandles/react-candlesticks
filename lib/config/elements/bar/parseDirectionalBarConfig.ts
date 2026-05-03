/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DirectionalBarConfig, DirectionalBarConfigComplete, directionalBarDefaults } from './DirectionalBarConfig';
import parseBarConfig from './parseBarConfig';

const parseDirectionalBarConfig = (
  partialConfig: false | DirectionalBarConfig = {},
  defaults: DirectionalBarConfig = {},
): null | DirectionalBarConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  return {
    up: parseBarConfig(partialConfig.up, { ...directionalBarDefaults.up, ...defaults.up })!,
    down: parseBarConfig(partialConfig.down, { ...directionalBarDefaults.down, ...defaults.down })!,
    flat: parseBarConfig(partialConfig.flat, { ...directionalBarDefaults.flat, ...defaults.flat })!,
  };
};

export default parseDirectionalBarConfig;
