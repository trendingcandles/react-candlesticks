/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseTimeLabelConfig from '../timeLabel/parseTimeLabelConfig';
import { BoxedTimeLabelConfigComplete, BoxedTimeLabelConfig, boxedTimeLabelDefaults, BoxedTimeLabelTheme } from './BoxedTimeLabelConfig';

const parseBoxedTimeLabelConfig = (
  partialConfig: false | BoxedTimeLabelConfig = {},
  boxedTimeLabelTheme: BoxedTimeLabelTheme,
): null | BoxedTimeLabelConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const valueLabelConfigComplete = parseTimeLabelConfig(partialConfig, boxedTimeLabelTheme);

  const boxedValueLabelConfigComplete: BoxedTimeLabelConfigComplete = {
    ...boxedTimeLabelDefaults,
    ...boxedTimeLabelTheme,
    ...valueLabelConfigComplete,
    backgroundColor: partialConfig.backgroundColor ?? boxedTimeLabelTheme.backgroundColor ?? boxedTimeLabelDefaults.backgroundColor,
    borderWidth: partialConfig.borderWidth ?? boxedTimeLabelTheme.borderWidth ?? boxedTimeLabelDefaults.borderWidth,
    borderColor: partialConfig.borderColor ?? boxedTimeLabelTheme.borderColor ?? boxedTimeLabelDefaults.borderColor,
    hPadding: partialConfig.hPadding ?? boxedTimeLabelTheme.hPadding ?? boxedTimeLabelDefaults.hPadding,
    vPadding: partialConfig.vPadding ?? boxedTimeLabelTheme.vPadding ?? boxedTimeLabelDefaults.vPadding,
  };

  return boxedValueLabelConfigComplete;
};

export default parseBoxedTimeLabelConfig;
