/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeLabelConfig, TimeLabelConfigComplete, timeLabelDefaults, TimeLabelTheme } from '../timeLabel/TimeLabelConfig';

export interface BoxedTimeLabelConfigComplete extends TimeLabelConfigComplete {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  hPadding: number;
  vPadding: number;
  borderRadius: number;
}

export interface BoxedTimeLabelConfig extends TimeLabelConfig {
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  hPadding?: number;
  vPadding?: number;
  borderRadius?: number;
}

export interface BoxedTimeLabelTheme extends TimeLabelTheme {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  hPadding: number;
  vPadding: number;
  borderRadius?: number;
}

export const boxedTimeLabelDefaults: BoxedTimeLabelConfigComplete = {
  ...timeLabelDefaults,
  top: 8,
  hPadding: 8,
  vPadding: 6,
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#1a1a1a',
  borderRadius: 0,
};
