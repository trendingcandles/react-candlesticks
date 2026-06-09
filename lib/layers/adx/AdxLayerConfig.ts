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

export interface AdxLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'adx';
  requiredInputKeys: RequiredInputKeys;
  diLength: number;
  smoothing: number;
  series: {
    value: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface AdxLayerConfig extends BaseLayerConfig {
  type: 'adx';
  diLength?: number;
  smoothing?: number;
  source?: {
    high?: LayerInputField;
    low?: LayerInputField;
    close?: LayerInputField;
  };
  series?: {
    value?: false | LineConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface AdxTheme {
  series: {
    value: LineTheme;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const adxDefaults: Omit<AdxLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'series' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'adx-layer',
  defaultScale: { key: 'value_bounded_0_100', domain: 'value', range: { type: 'bounded', min: 0, max: 100 } },
  indicator: true,
  inputs: [
    { key: 'high', source: { type: 'price', field: 'high' } },
    { key: 'low', source: { type: 'price', field: 'low' } },
    { key: 'close', source: { type: 'price', field: 'close' } },
  ],
  outputs: ['value'],
  diLength: 14,
  smoothing: 14,
  period: 14,
  offset: 0,
  lookback: (period: number) => period * 2,
  valueToY: (min: number = 0, max: number = 100, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
