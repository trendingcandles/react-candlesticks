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

type RequiredInputKeys = ['input'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['input'];

export interface RsiLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'rsi';
  requiredInputKeys: RequiredInputKeys;
  series: {
    value: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface RsiLayerConfig extends BaseLayerConfig {
  type: 'rsi';
  source?: LayerInputField;
  series?: {
    value?: false | LineConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface RsiTheme {
  series: {
    value: LineConfigComplete;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const rsiDefaults: Omit<RsiLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'rsi-layer',
  defaultScale: { key: 'value_bounded_0_100', domain: 'value', range: { type: 'bounded', min: 0, max: 100 } },
  indicator: true,
  inputs: [
    { key: 'input', source: { type: 'price', field: 'close' } }
  ],
  period: 14,
  offset: 0,
  lookback: (period: number) => period * 3, // cumulative: required longer lookback
  valueToY: (min: number = 0, max: number = 100, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
  series: {
    value: { color: '#1a1a1a', style: 'solid', width: 1 },
  },
};
