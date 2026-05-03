/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { boxedTimeLabelDefaults } from '../../../../elements/boxedTimeLabel/BoxedTimeLabelConfig';
import parseBoxedTimeLabelConfig from '../../../../elements/boxedTimeLabel/parseBoxedTimeLabelConfig';
import defaultTimeCrosshairLabelFormatter from './defaultTimeCrosshairLabelFormatter';
import { TimeCrosshairLabelConfig, TimeCrosshairLabelConfigComplete, TimeCrosshairLabelTheme } from './TimeCrosshairLabelConfig';

const parseTimeCrosshairLabelConfig = (
  partialConfig: false | TimeCrosshairLabelConfig = {},
  timeCrosshairLabelTheme: TimeCrosshairLabelTheme,
): null | TimeCrosshairLabelConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const { formatter, ...restPartialConfig } = partialConfig;

  const valueLabelConfigComplete = parseBoxedTimeLabelConfig(restPartialConfig, timeCrosshairLabelTheme);

  const boxedValueLabelConfigComplete: TimeCrosshairLabelConfigComplete = {
    ...boxedTimeLabelDefaults,
    ...timeCrosshairLabelTheme,
    ...valueLabelConfigComplete,
    formatter: formatter ?? defaultTimeCrosshairLabelFormatter,
  };

  return boxedValueLabelConfigComplete;
};

export default parseTimeCrosshairLabelConfig;
