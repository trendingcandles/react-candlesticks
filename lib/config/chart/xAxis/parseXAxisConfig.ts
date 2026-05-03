/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../elements/line/parseLineConfig';
import parseTimeLabelConfig from '../../elements/timeLabel/parseTimeLabelConfig';
import { XAxisConfigComplete, XAxisConfig, xAxisDefaults, XAxisTheme } from './XAxisConfig';
import { assertPositiveNumber } from '../../utils/validateNumber';

const parseXAxisConfig = (partialConfig: false | XAxisConfig = {}, timeAxisTheme: XAxisTheme, defaultTimeZoneId?: string): null | XAxisConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const height = assertPositiveNumber(
    partialConfig.height ?? timeAxisTheme.height ?? xAxisDefaults.height,
    'xAxis.height',
  );

  return {
    height,
    border: parseLineConfig(partialConfig.border, timeAxisTheme.border),
    minorLabels: parseTimeLabelConfig(partialConfig.minorLabels, timeAxisTheme.minorLabels),
    majorLabels: parseTimeLabelConfig(partialConfig.majorLabels, timeAxisTheme.majorLabels),
    timeZoneId: partialConfig.timeZoneId ?? defaultTimeZoneId ?? null,
  }; 
};

export default parseXAxisConfig;
