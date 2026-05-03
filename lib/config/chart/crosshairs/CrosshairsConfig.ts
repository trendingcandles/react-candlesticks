/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeCrosshairConfig, TimeCrosshairConfigComplete, TimeCrosshairTheme } from './timeCrosshair/TimeCrosshairConfig';
import { ValueCrosshairConfig, ValueCrosshairConfigComplete, ValueCrosshairTheme } from './valueCrosshair/ValueCrosshairConfig';

export interface CrosshairsConfigComplete {
  value: null | ValueCrosshairConfigComplete;
  time: null | TimeCrosshairConfigComplete;
}

export interface CrosshairsConfig {
  value?: false | ValueCrosshairConfig;
  time?: false | TimeCrosshairConfig;
}

export interface CrosshairsTheme {
  time: TimeCrosshairTheme;
  value: ValueCrosshairTheme;
}