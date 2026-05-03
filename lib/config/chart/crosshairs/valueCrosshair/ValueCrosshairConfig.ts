/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete } from '../../../elements/line/LineConfig';
import { ValueCrosshairLabelConfig, ValueCrosshairLabelConfigComplete, ValueCrosshairLabelTheme } from './valueCrosshairLabel/ValueCrosshairLabelConfig';

export interface ValueCrosshairConfigComplete {
  line: null | LineConfigComplete;
  label: null | ValueCrosshairLabelConfigComplete;
}

export interface ValueCrosshairConfig {
  line?: false | LineConfig;
  label?: false | ValueCrosshairLabelConfig;
}

export interface ValueCrosshairTheme {
  line: LineConfigComplete;
  label: ValueCrosshairLabelTheme;
}
