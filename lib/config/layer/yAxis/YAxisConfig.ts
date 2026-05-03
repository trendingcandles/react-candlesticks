/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete } from '../../elements/line/LineConfig';
import { ValueLabelConfig, ValueLabelConfigComplete, valueLabelDefaults } from '../../elements/valueLabel/ValueLabelConfig';

export interface YAxisConfigComplete {
  side: 'left' | 'right';  // todo: tier variation
  width: number;
  border: null | LineConfigComplete;
  labels: null | ValueLabelConfigComplete;
}

export interface YAxisConfig {
  side?: 'left' | 'right';  // todo: tier variation
  width?: number;
  border?: false | LineConfig;
  labels?: false | ValueLabelConfig;
}

export interface YAxisTheme {
  side: 'left' | 'right';  // todo: tier variation
  width: number;
  border: LineConfigComplete;
  labels: ValueLabelConfigComplete;
}

export const yAxisDefaults: Pick<YAxisConfigComplete, 'width' | 'side'> = {
  width: 80,
  side: 'right',
};

export const themeDefaultYAxis: YAxisTheme = {
  ...yAxisDefaults,
  border: { color: '#ddd', width: 1, style: 'solid' },
  labels: {...valueLabelDefaults, padding: 6 },
};
