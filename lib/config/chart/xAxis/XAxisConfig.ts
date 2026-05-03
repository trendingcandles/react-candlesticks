/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete } from '../../elements/line/LineConfig';
import { TimeLabelConfig, TimeLabelConfigComplete } from '../../elements/timeLabel/TimeLabelConfig';

export interface XAxisConfigComplete {
  height: number;
  border: null | LineConfigComplete;
  minorLabels: null | TimeLabelConfigComplete;
  majorLabels: null | TimeLabelConfigComplete;
  timeZoneId: null | string;
}

export interface XAxisConfig {
  height?: number;
  border?: false | LineConfig;
  minorLabels?: false | TimeLabelConfig;
  majorLabels?: false | TimeLabelConfig;
  timeZoneId?: string;
}

export interface XAxisTheme {
  height: number;
  border: LineConfigComplete;
  minorLabels: Omit<TimeLabelConfigComplete, 'formatter'>;
  majorLabels: Omit<TimeLabelConfigComplete, 'formatter'>;
};

export const xAxisDefaults: Pick<XAxisConfigComplete, 'height'> = {
  height: 36,
};
