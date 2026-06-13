/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, PriceField, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LineConfig, LineConfigComplete } from '../../config/elements/line/LineConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['high', 'low'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['high', 'low'];

export interface ParabolicSarLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'parabolic-sar';
  requiredInputKeys: RequiredInputKeys;
  start: number;
  increment: number;
  maxValue: number;
  series: {
    value: null | LineConfigComplete;
  };
}

export interface ParabolicSarLayerConfig extends BaseLayerConfig {
  type: 'parabolic-sar';
  source?: {
    high?: PriceField;
    low?: PriceField;
  };
  start?: number;
  increment?: number;
  maxValue?: number;
  series?: {
    value?: false | LineConfig;
  };
}

export interface ParabolicSarTheme {
  series: {
    value: LineConfigComplete;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const parabolicSarDefaults: Omit<ParabolicSarLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'series' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'parabolic-sar-layer',
  defaultScale: { key: 'price_auto', domain: 'price', range: { type: 'auto' } },
  indicator: true,
  inputs: [
    { key: 'high', source: { type: 'price', field: 'high' } },
    { key: 'low', source: { type: 'price', field: 'low' } },
  ],
  start: 0.02,
  increment: 0.02,
  maxValue: 0.2,
  period: 1,
  offset: 0,
  lookback: 2,
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
