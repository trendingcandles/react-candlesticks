/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BoxedTimeLabelConfig, BoxedTimeLabelConfigComplete, boxedTimeLabelDefaults, BoxedTimeLabelTheme } from '../../../../elements/boxedTimeLabel/BoxedTimeLabelConfig';
import defaultTimeCrosshairLabelFormatter from './defaultTimeCrosshairLabelFormatter';
import { TimeCrosshairLabelFormatter } from './TimeCrosshairLabelFormatter';

export interface TimeCrosshairLabelConfigComplete extends Omit<BoxedTimeLabelConfigComplete, 'formatter'> {
  formatter: TimeCrosshairLabelFormatter;
}

export interface TimeCrosshairLabelConfig extends Omit<BoxedTimeLabelConfig, 'formatter'> {
  formatter?: TimeCrosshairLabelFormatter;
}

export type TimeCrosshairLabelTheme = BoxedTimeLabelTheme;

export const timeCrosshairLabelDefaults: TimeCrosshairLabelConfigComplete = {
  ...boxedTimeLabelDefaults,
  top: 8,
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#1a1a1a',
  formatter: defaultTimeCrosshairLabelFormatter,
};
