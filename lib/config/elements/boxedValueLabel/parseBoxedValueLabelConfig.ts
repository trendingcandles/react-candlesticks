/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseValueLabelConfig from '../valueLabel/parseValueLabelConfig';
import { BoxedValueLabelConfig, BoxedValueLabelConfigComplete, boxedValueLabelDefaults, BoxedValueLabelTheme } from './BoxedValueLabelConfig';

const parseBoxedValueLabelConfig = (
  partialConfig: false | BoxedValueLabelConfig = {},
  boxedValueLabelTheme: BoxedValueLabelTheme,
  backgroundColor?: string,
): null | BoxedValueLabelConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const valueLabelConfigComplete = parseValueLabelConfig(partialConfig, boxedValueLabelTheme);

  const boxedValueLabelConfigComplete: BoxedValueLabelConfigComplete = {
    ...boxedValueLabelDefaults,
    ...boxedValueLabelTheme,
    ...valueLabelConfigComplete,
    backgroundColor: partialConfig.backgroundColor ?? backgroundColor ?? boxedValueLabelTheme.backgroundColor ?? boxedValueLabelDefaults.backgroundColor,
    borderWidth: partialConfig.borderWidth ?? boxedValueLabelTheme.borderWidth ?? boxedValueLabelDefaults.borderWidth,
    borderColor: partialConfig.borderColor ?? boxedValueLabelTheme.borderColor ?? boxedValueLabelDefaults.borderColor,
    hPadding: partialConfig.hPadding ?? boxedValueLabelTheme.hPadding ?? boxedValueLabelDefaults.hPadding,
    vPadding: partialConfig.vPadding ?? boxedValueLabelTheme.vPadding ?? boxedValueLabelDefaults.vPadding,
  };

  return boxedValueLabelConfigComplete;
};

export default parseBoxedValueLabelConfig;
