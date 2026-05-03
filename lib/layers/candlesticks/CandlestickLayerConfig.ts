/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults, InputSource } from '../../config/layer/BaseLayerConfig';
import { DirectionalValueMarkerConfig, DirectionalValueMarkerConfigComplete, DirectionalValueMarkerTheme } from '../../config/valueMarker/DirectionalValueMarkerConfig';
import { DirectionalBarConfig, DirectionalBarConfigComplete, DirectionalBarTheme } from '../../config/elements/bar/DirectionalBarConfig';
import { DirectionalLineConfig, DirectionalLineConfigComplete, DirectionalLineTheme } from '../../config/elements/line/DirectionalLineConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['open', 'high', 'low', 'close'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['open', 'high', 'low', 'close'];

export interface CandlestickLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'price:candlesticks';
  requiredInputKeys: RequiredInputKeys;
  series: {
    body: null | DirectionalBarConfigComplete;
    wick: null | DirectionalLineConfigComplete;
  };
  markers: {
    value: null | DirectionalValueMarkerConfigComplete;
  };
}

export interface CandlestickLayerConfig extends BaseLayerConfig {
  type: 'price:candlesticks';
  series?: {
    body?: false | DirectionalBarConfig;
    wick?: false | DirectionalLineConfig;
  };
  markers?: {
    value?: false | DirectionalValueMarkerConfig;
  };
}

export interface CandlesticksTheme {
  series: {
    body: DirectionalBarTheme;
    wick: DirectionalLineTheme;
  };
  markers: {
    value: DirectionalValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const candlestickLayerDefaults: Omit<CandlestickLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'period' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'candlestick-layer',
  indicator: false,
  defaultScale: { key: 'price_auto', domain: 'price', range: { type: 'auto' } },
  inputs: [
    { key: 'open', source: { type: 'price', field: 'open' } },
    { key: 'high', source: { type: 'price', field: 'high' } },
    { key: 'low',  source: { type: 'price', field: 'low' } },
    { key: 'close', source: { type: 'price', field: 'close' } }
  ] as InputSource[],
  outputs: ['open', 'high', 'low', 'close'],
  offset: 0,
  series: {
    body: {
      up: { width: 0.6, backgroundColor: '#10b981', borderColor: '#10b981', borderWidth: 0 },
      down: { width: 0.6, backgroundColor: '#ef4444', borderColor: '#ef4444', borderWidth: 0 },
      flat: { width: 0.6, backgroundColor: '#999', borderColor: '#999', borderWidth: 0 },
    },
    wick: {
      up: { width: 1, color: '#10b981', style: 'solid' },
      down: { width: 1, color: '#ef4444', style: 'solid' },
      flat: { width: 1, color: '#999', style: 'solid' },
    },
  },
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
