/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ValueLabelConfig, ValueLabelConfigComplete, valueLabelDefaults, ValueLabelTheme } from '../valueLabel/ValueLabelConfig';

export interface BoxedValueLabelConfigComplete extends ValueLabelConfigComplete {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  hPadding: number;
  vPadding: number;
}

export interface BoxedValueLabelConfig extends ValueLabelConfig {
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  hPadding?: number;
  vPadding?: number;
}

export interface BoxedValueLabelTheme extends ValueLabelTheme {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  hPadding: number;
  vPadding: number;
}

export const boxedValueLabelDefaults: BoxedValueLabelConfigComplete = {
  ...valueLabelDefaults,
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#1a1a1a',
  hPadding: 8,
  vPadding: 6,
};
