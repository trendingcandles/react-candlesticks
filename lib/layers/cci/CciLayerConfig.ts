/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, PriceField, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LineConfig, LineConfigComplete, LineTheme } from '../../config/elements/line/LineConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['high', 'low', 'close'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['high', 'low', 'close'];

export interface CciLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'cci';
  requiredInputKeys: RequiredInputKeys;
  length: number;
  smoothingLength: number;
  series: {
    value: null | LineConfigComplete;
    smoothing: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
    smoothing: null | ValueMarkerConfigComplete;
  };
}

export interface CciLayerConfig extends BaseLayerConfig {
  type: 'cci';
  source?: {
    high?: PriceField;
    low?: PriceField;
    close?: PriceField;
  };
  length?: number;
  smoothingLength?: number;
  series?: {
    value?: false | LineConfig;
    smoothing?: false | LineConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
    smoothing?: false | ValueMarkerConfig;
  };
}

export interface CciTheme {
  series: {
    value: LineTheme;
    smoothing: LineTheme;
  };
  markers: {
    value: ValueMarkerTheme;
    smoothing: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const cciDefaults: Omit<CciLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'series' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'cci-layer',
  defaultScale: { key: 'value_auto', domain: 'value', range: { type: 'auto' } },
  indicator: true,
  inputs: [
    { key: 'high', source: { type: 'price', field: 'high' } },
    { key: 'low', source: { type: 'price', field: 'low' } },
    { key: 'close', source: { type: 'price', field: 'close' } },
  ],
  outputs: ['value', 'smoothing'],
  length: 20,
  smoothingLength: 14,
  period: 20,
  offset: 0,
  lookback: (period: number) => period * 2,
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
