/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LineConfig, LineConfigComplete, LineTheme } from '../../config/elements/line/LineConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';
import { LayerInputField } from '../../config/layer/inputSourceShorthand';

type RequiredInputKeys = ['high', 'low', 'close'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['high', 'low', 'close'];

export interface StochasticLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'stochastic';
  requiredInputKeys: RequiredInputKeys;
  kPeriod: number;
  kSmoothing: number;
  dPeriod: number;
  series: {
    k: null | LineConfigComplete;
    d: null | LineConfigComplete;
  };
  markers: {
    k: null | ValueMarkerConfigComplete;
    d: null | ValueMarkerConfigComplete;
  };
}

export interface StochasticLayerConfig extends BaseLayerConfig {
  type: 'stochastic';
  source?: {
    high?: LayerInputField;
    low?: LayerInputField;
    close?: LayerInputField;
  };
  kPeriod?: number;
  kSmoothing?: number;
  dPeriod?: number;
  series?: {
    k?: false | LineConfig;
    d?: false | LineConfig;
  };
  markers?: {
    k?: false | ValueMarkerConfig;
    d?: false | ValueMarkerConfig;
  };
}

export interface StochasticTheme {
  series: {
    k: LineTheme;
    d: LineTheme;
  };
  markers: {
    k: ValueMarkerTheme;
    d: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const getStochasticLookback = (
  kPeriod: number,
  kSmoothing: number,
  dPeriod: number,
) => kPeriod + kSmoothing + dPeriod - 3;

export const stochasticDefaults: Omit<StochasticLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'series' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'stochastic-layer',
  defaultScale: { key: 'value_bounded_0_100', domain: 'value', range: { type: 'bounded', min: 0, max: 100 } },
  indicator: true,
  inputs: [
    { key: 'high', source: { type: 'price', field: 'high' } },
    { key: 'low',  source: { type: 'price', field: 'low' } },
    { key: 'close', source: { type: 'price', field: 'close' } }
  ],
  outputs: ['k', 'kSmoothed', 'd'],
  kPeriod: 14,
  period: 14, // k period
  kSmoothing: 3,
  dPeriod: 3,
  offset: 0,
  lookback: getStochasticLookback(14, 3, 3),
  valueToY: (min: number = 0, max: number = 100, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
