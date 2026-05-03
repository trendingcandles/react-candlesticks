/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLabelConfig from '../label/parseLabelConfig';
import { ValueLabelConfigComplete, ValueLabelConfig, valueLabelDefaults, ValueLabelTheme } from './ValueLabelConfig';

const parseValueLabelConfig = (partialConfig: false | ValueLabelConfig = {}, valueLabelTheme: ValueLabelTheme): null | ValueLabelConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const labelComplete = parseLabelConfig(partialConfig, valueLabelTheme);

  const valueLabelComplete: ValueLabelConfigComplete = {
    ...labelComplete,
    padding: partialConfig.padding ?? valueLabelTheme.padding ?? valueLabelDefaults.padding,
  };

  return valueLabelComplete;
};

export default parseValueLabelConfig;
