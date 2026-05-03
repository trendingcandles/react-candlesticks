/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../elements/line/parseLineConfig';
import { GridConfig, GridConfigComplete, GridTheme } from './GridConfig';

const parseGridConfig = (partialConfig: false | GridConfig = {}, gridTheme: GridTheme): null | GridConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  return {
    time: parseLineConfig(partialConfig.time, gridTheme.time),
    value: parseLineConfig(partialConfig.value, gridTheme.value),
  };
};

export default parseGridConfig;
