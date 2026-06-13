/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, PriceField, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LineConfig, LineConfigComplete } from '../../config/elements/line/LineConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['high', 'low', 'close'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['high', 'low', 'close'];

export interface WilliamsRLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'williams-r';
  requiredInputKeys: RequiredInputKeys;
  length: number;
  series: {
    value: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface WilliamsRLayerConfig extends BaseLayerConfig {
  type: 'williams-r';
  source?: {
    high?: PriceField;
    low?: PriceField;
    close?: PriceField;
  };
  length?: number;
  series?: {
    value?: false | LineConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface WilliamsRTheme {
  series: {
    value: LineConfigComplete;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const williamsRDefaults: Omit<WilliamsRLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'series' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'williams-r-layer',
  defaultScale: { key: 'value_bounded_-100_0', domain: 'value', range: { type: 'bounded', min: -100, max: 0 } },
  indicator: true,
  inputs: [
    { key: 'high', source: { type: 'price', field: 'high' } },
    { key: 'low', source: { type: 'price', field: 'low' } },
    { key: 'close', source: { type: 'price', field: 'close' } },
  ],
  length: 14,
  period: 14,
  offset: 0,
  lookback: (period: number) => period * 2,
  valueToY: (min: number = -100, max: number = 0, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
