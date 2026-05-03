/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete } from '../../config/elements/line/LineConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['input'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['input'];

export interface PriceLineLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'price:line';
  requiredInputKeys: RequiredInputKeys;
  offset: 0;
  series: {
    value: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface PriceLineLayerConfig extends BaseLayerConfig {
  type: 'price:line';
  series?: {
    value?: false | LineConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface PriceLineTheme {
  series: {
    value: LineConfigComplete;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const priceLineLayerDefaults: Omit<PriceLineLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'period' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'price-line',
  defaultScale:{ key: 'price_auto', domain: 'price', range: { type: 'auto' } },
  inputs: [
    { key: 'input', source: { type: 'price', field: 'close' } },
  ],
  outputs: ['price'],
  offset: 0,
  series: {
    value: { color: 'dodgerblue', width: 2, style: 'solid', endDotSize: 5 },
  },
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
