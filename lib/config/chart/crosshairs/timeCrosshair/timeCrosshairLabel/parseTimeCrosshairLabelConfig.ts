/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseBoxedTimeLabelConfig from '../../../../elements/boxedTimeLabel/parseBoxedTimeLabelConfig';
import defaultTimeCrosshairLabelFormatter from './defaultTimeCrosshairLabelFormatter';
import { TimeCrosshairLabelConfig, TimeCrosshairLabelConfigComplete, timeCrosshairLabelDefaults, TimeCrosshairLabelTheme } from './TimeCrosshairLabelConfig';

const parseTimeCrosshairLabelConfig = (
  partialConfig: false | TimeCrosshairLabelConfig = {},
  timeCrosshairLabelTheme: TimeCrosshairLabelTheme,
): null | TimeCrosshairLabelConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const { formatter, ...restPartialConfig } = partialConfig;
  const labelTheme = {
    ...timeCrosshairLabelTheme,
    borderRadius: timeCrosshairLabelTheme.borderRadius ?? timeCrosshairLabelDefaults.borderRadius,
  };

  const valueLabelConfigComplete = parseBoxedTimeLabelConfig(restPartialConfig, labelTheme);

  const boxedValueLabelConfigComplete: TimeCrosshairLabelConfigComplete = {
    ...timeCrosshairLabelDefaults,
    ...labelTheme,
    ...valueLabelConfigComplete,
    formatter: formatter ?? defaultTimeCrosshairLabelFormatter,
  };

  return boxedValueLabelConfigComplete;
};

export default parseTimeCrosshairLabelConfig;
