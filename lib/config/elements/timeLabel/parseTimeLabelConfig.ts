/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLabelConfig from '../label/parseLabelConfig';
import { TimeLabelConfigComplete, TimeLabelConfig, timeLabelDefaults, TimeLabelTheme } from './TimeLabelConfig';

const parseTimeLabelConfig = (partialConfig: false | TimeLabelConfig = {}, timeLabelTheme: TimeLabelTheme): null | TimeLabelConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const labelComplete = parseLabelConfig(partialConfig, timeLabelTheme);

  const timeLabelComplete: TimeLabelConfigComplete = {
    ...labelComplete,
    top: partialConfig.top ?? timeLabelTheme.top ?? timeLabelDefaults.top,
    formatter: partialConfig.formatter ?? timeLabelDefaults.formatter,
  };

  return timeLabelComplete;
};

export default parseTimeLabelConfig;
