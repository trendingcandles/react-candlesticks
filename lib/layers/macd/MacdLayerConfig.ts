/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { LineConfig, LineConfigComplete, LineTheme } from '../../config/elements/line/LineConfig';
import { BarConfig, BarConfigComplete } from '../../config/elements/bar/BarConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';
import { LayerInputField } from '../../config/layer/inputSourceShorthand';

type RequiredInputKeys = ['input'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['input'];

export interface MacdLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'macd';
  requiredInputKeys: RequiredInputKeys;
  fastPeriod: number;
  period: number; // fast period
  slowPeriod: number;
  signalPeriod: number;
  series: {
    macd: null | LineConfigComplete;
    signal: null | LineConfigComplete;
    histogramUp: null | BarConfigComplete;
    histogramDown: null | BarConfigComplete;
  };
  markers: {
    macd: null | ValueMarkerConfigComplete;
    signal: null | ValueMarkerConfigComplete;
  };
}

export interface MacdLayerConfig extends BaseLayerConfig {
  type: 'macd';
  source?: LayerInputField;
  fastPeriod?: number;
  period?: number; // fast period
  slowPeriod?: number;
  signalPeriod?: number;
  series?: {
    macd?: false | LineConfig;
    signal?: false | LineConfig;
    histogramUp?: false | BarConfig;
    histogramDown?: false | BarConfig;
  };
  markers?: {
    macd?: false | ValueMarkerConfig;
    signal?: false | ValueMarkerConfig;
  };
}

export interface MacdTheme {
  series: {
    macd: LineTheme;
    signal: LineTheme;
    histogramUp: BarConfigComplete;
    histogramDown: BarConfigComplete;
  };
  markers: {
    macd: ValueMarkerTheme;
    signal: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const macdDefaults: Omit<MacdLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'series' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'macd-layer',
  defaultScale: { key: 'value_zero-centered', domain: 'value', range: { type: 'zero-centered' } },
  indicator: true,
  inputs: [
    { key: 'input', source: { type: 'price', field: 'close' } }
  ],
  outputs: ['macd', 'signal', 'histogram'],
  fastPeriod: 12,
  period: 12, // fast period
  slowPeriod: 26,
  signalPeriod: 9,
  offset: 0,
  lookback: (period: number) => period * 3,
  valueToY: (min: number = 0, max: number = 100, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
