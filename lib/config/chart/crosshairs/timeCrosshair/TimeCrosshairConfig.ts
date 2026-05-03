/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete } from '../../../elements/line/LineConfig';
import { TimeCrosshairLabelConfig, TimeCrosshairLabelConfigComplete } from './timeCrosshairLabel/TimeCrosshairLabelConfig';

export interface TimeCrosshairConfigComplete {
  line: null | LineConfigComplete;
  label: null | TimeCrosshairLabelConfigComplete;
}

export interface TimeCrosshairConfig {
  line?: false | LineConfig;
  label?: false | TimeCrosshairLabelConfig;
}

export interface TimeCrosshairTheme {
  line: LineConfigComplete;
  label: Omit<TimeCrosshairLabelConfigComplete, 'formatter'>;
};
