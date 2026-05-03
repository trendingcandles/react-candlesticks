/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LabelConfig, LabelConfigComplete, labelDefaults, LabelTheme } from '../label/LabelConfig';

export interface ValueLabelConfigComplete extends LabelConfigComplete {
  padding: number; // px
}

export interface ValueLabelConfig extends LabelConfig {
  padding?: number; // px
}

export interface ValueLabelTheme extends LabelTheme {
  padding: number;
}

export const valueLabelDefaults: ValueLabelConfigComplete = {
  ...labelDefaults,
  padding: 0,
};
