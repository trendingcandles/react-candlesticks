/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LineConfig, LineConfigComplete, LineTheme } from '../../config/elements/line/LineConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { PriceField } from '../../config/layer/BaseLayerConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['price', 'volume'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['price', 'volume'];

export interface ObvLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'obv';
  requiredInputKeys: RequiredInputKeys;
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

export interface ObvLayerConfig extends BaseLayerConfig {
  type: 'obv';
  source?: PriceField;
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

export interface ObvTheme {
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

export const obvDefaults: Omit<ObvLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'series' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'obv-layer',
  defaultScale: { key: 'value_auto', domain: 'value', range: { type: 'auto' } },
  indicator: true,
  inputs: [
    { key: 'price', source: { type: 'price', field: 'close' } },
    { key: 'volume', source: { type: 'volume', field: 'volume' } },
  ],
  outputs: ['value', 'smoothing'],
  smoothingLength: 14,
  period: 14,
  offset: 0,
  lookback: 0,
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
