/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BoxedValueLabelConfig, BoxedValueLabelConfigComplete, boxedValueLabelDefaults, BoxedValueLabelTheme } from '../elements/boxedValueLabel/BoxedValueLabelConfig';
import { LineConfig, LineConfigComplete, lineDefaults } from '../elements/line/LineConfig';
import { ValueMarkerMode } from './ValueMarkerMode';

export interface ValueMarkerConfigComplete {
  mode: ValueMarkerMode;
  line: null | LineConfigComplete;
  label: null | BoxedValueLabelConfigComplete;
}

export interface ValueMarkerConfig {
  mode?: ValueMarkerMode;
  line?: false | LineConfig;
  label?: false | BoxedValueLabelConfig;
}

export interface ValueMarkerTheme {
  line: LineConfigComplete;
  label: BoxedValueLabelTheme;
}

export const valueMarkerDefaults: Pick<ValueMarkerConfigComplete, 'mode' | 'line'> = {
  mode: 'last-visible' as const,
  line: null,
};

export const themeDefaultValueMarker: ValueMarkerTheme = {
  line: {
    ...lineDefaults,
    style: 'dashed',
    dashes: [5, 5],
    endDotSize: 0,
  },
  label: {
    ...boxedValueLabelDefaults,
  },
};
