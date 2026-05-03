/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BoxedValueLabelConfig, BoxedValueLabelConfigComplete, boxedValueLabelDefaults, BoxedValueLabelTheme } from '../../../../elements/boxedValueLabel/BoxedValueLabelConfig';

export type ValueCrosshairLabelConfigComplete = BoxedValueLabelConfigComplete;

export type ValueCrosshairLabelConfig = BoxedValueLabelConfig;

export type ValueCrosshairLabelTheme = BoxedValueLabelTheme;

export const valueCrosshairLabelDefaults: BoxedValueLabelConfigComplete = {
  ...boxedValueLabelDefaults,
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#1a1a1a',
  hPadding: 8,
  vPadding: 6,
};
