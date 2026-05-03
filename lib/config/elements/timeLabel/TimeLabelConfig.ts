/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LabelConfig, LabelConfigComplete, labelDefaults, LabelTheme } from '../label/LabelConfig';
import defaultTimeLabelFormatter from './defaultTimeLabelFormatter';
import { TimeLabelFormatter } from './TimeLabelFormatter';

export interface TimeLabelConfigComplete extends LabelConfigComplete {
  top: number; // px
  formatter: TimeLabelFormatter;
}

export interface TimeLabelConfig extends LabelConfig {
  top?: number; // px
  formatter?: TimeLabelFormatter;
}

export interface TimeLabelTheme extends LabelTheme {
  top: number;
}

export const timeLabelDefaults: TimeLabelConfigComplete = {
  ...labelDefaults,
  top: 8,
  formatter: defaultTimeLabelFormatter,
};
