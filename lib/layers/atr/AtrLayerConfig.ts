/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LineConfig, LineConfigComplete } from '../../config/elements/line/LineConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';
import { LayerInputField } from '../../config/layer/inputSourceShorthand';

type RequiredInputKeys = ['high', 'low', 'close'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['high', 'low', 'close'];

export interface AtrLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'atr';
  requiredInputKeys: RequiredInputKeys;
  series: {
    value: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface AtrLayerConfig extends BaseLayerConfig {
  type: 'atr';
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

export interface AtrTheme {
  series: {
    value: LineConfigComplete;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const atrDefaults: Omit<AtrLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'atr-layer',
  defaultScale: { key: 'value_auto', domain: 'value', range: { type: 'auto' } },
  indicator: true, 
  inputs: [
    { key: 'high', source: { type: 'price', field: 'high' } },
    { key: 'low',  source: { type: 'price', field: 'low' } },
    { key: 'close', source: { type: 'price', field: 'close' } }
  ],
  period: 14,
  offset: 0,
  lookback: (period: number) => period * 3,
  valueToY: (min: number = 0, max: number = 100, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
  series: {
    value: { color: '#1a1a1a', style: 'solid', width: 1 },
  },
};
