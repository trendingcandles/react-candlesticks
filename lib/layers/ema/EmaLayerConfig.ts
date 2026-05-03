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

export interface EmaLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'ema';
  requiredInputKeys: RequiredInputKeys;
  offset: number;
  series: {
    value: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface EmaLayerConfig extends BaseLayerConfig {
  type: 'ema';
  source?: LayerInputField;
  offset?: number;
  series?: {
    value?: false | LineConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface EmaTheme {
  series: {
    value: LineConfigComplete;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const emaDefaults: Omit<EmaLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'ema-layer',
  defaultScale: { key: 'price_auto', domain: 'price', range: { type: 'auto' } },
  indicator: true,
  inputs: [
    { key: 'input', source: { type: 'price', field: 'close' } },
  ],
  period: 50, // 9, 12, 26, 50
  includeInAutoScale: false,
  lookback: (period: number) => period * 3,
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
  offset: 0,
  series: {
    value: { color: '#1a1a1a', style: 'solid', width: 1 },
  },
};
