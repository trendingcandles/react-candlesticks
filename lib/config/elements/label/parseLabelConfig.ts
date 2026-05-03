/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LabelConfigComplete, LabelConfig, labelDefaults, LabelTheme } from './LabelConfig';

const parseLabelConfig = (partialConfig: LabelConfig = {}, labelTheme: LabelTheme): LabelConfigComplete => {
  return {
    color: partialConfig?.color ?? labelTheme.color ?? labelDefaults.color,
    fontFamily: partialConfig?.fontFamily ?? labelTheme.fontFamily ?? labelDefaults.fontFamily,
    fontSize: partialConfig?.fontSize ?? labelTheme.fontSize ?? labelDefaults.fontSize,
    fontWeight: partialConfig?.fontWeight ?? labelTheme.fontWeight ?? labelDefaults.fontWeight,
    fontVariant: partialConfig?.fontVariant ?? labelTheme.fontVariant ?? labelDefaults.fontVariant,
    fontStyle: partialConfig?.fontStyle ?? labelTheme.fontStyle ?? labelDefaults.fontStyle,
  };
};

export default parseLabelConfig;
