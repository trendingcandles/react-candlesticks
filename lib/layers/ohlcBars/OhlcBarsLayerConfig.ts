/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults, InputSource } from '../../config/layer/BaseLayerConfig';
import { DirectionalBarConfig, DirectionalBarConfigComplete, DirectionalBarTheme } from '../../config/elements/bar/DirectionalBarConfig';
import { DirectionalValueMarkerConfig, DirectionalValueMarkerConfigComplete, DirectionalValueMarkerTheme } from '../../config/valueMarker/DirectionalValueMarkerConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';
import { LayerHit } from '../../config/layer/Layer';

type RequiredInputKeys = ['open', 'high', 'low', 'close'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['open', 'high', 'low', 'close'];

export interface OhlcBarsLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'price:ohlc-bars';
  requiredInputKeys: RequiredInputKeys;
  series: {
    bars: null | DirectionalBarConfigComplete;
  };
  markers: {
    value: null | DirectionalValueMarkerConfigComplete;
  };
  onBarHover?: (hit: LayerHit | null) => void;
  onBarClick?: (hit: LayerHit) => void;
}

export interface OhlcBarsLayerConfig extends BaseLayerConfig {
  type: 'price:ohlc-bars';
  series?: {
    bars?: false | DirectionalBarConfig;
  };
  markers?: {
    value?: false | DirectionalValueMarkerConfig;
  };
  onBarHover?: (hit: LayerHit | null) => void;
  onBarClick?: (hit: LayerHit) => void;
}

export interface OhlcBarsTheme {
  series: {
    bars: DirectionalBarTheme;
  };
  markers: {
    value: DirectionalValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const ohlcBarsLayerDefaults: Omit<OhlcBarsLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'period' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'ohlc-bars-layer',
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
    bars: {
      up: { width: 0.6, backgroundColor: '#10b981', borderColor: '#10b981', borderWidth: 1 },
      down: { width: 0.6, backgroundColor: '#ef4444', borderColor: '#ef4444', borderWidth: 1 },
      flat: { width: 0.6, backgroundColor: '#999', borderColor: '#999', borderWidth: 1 },
    },
  },
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
