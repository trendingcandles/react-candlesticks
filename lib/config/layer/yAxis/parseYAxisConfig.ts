/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../elements/line/parseLineConfig';
import parseValueLabelConfig from '../../elements/valueLabel/parseValueLabelConfig';
import { YAxisConfigComplete, YAxisConfig, yAxisDefaults, YAxisTheme } from './YAxisConfig';

const parseYAxisConfig = (partialConfig: false | YAxisConfig = {}, valueAxisTheme: YAxisTheme): null | YAxisConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  return {
    side: partialConfig.side ?? valueAxisTheme.side ?? yAxisDefaults.side, // todo: tier variation
    width: partialConfig.width ?? valueAxisTheme.width ?? yAxisDefaults.width,
    border: parseLineConfig(partialConfig.border, valueAxisTheme.border),
    labels: parseValueLabelConfig(partialConfig.labels, valueAxisTheme.labels),
  }; 
};

export default parseYAxisConfig;
