/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { DirectionalBarConfig, DirectionalBarConfigComplete } from '../../config/elements/bar/DirectionalBarConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['volume'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['volume']

export interface VolumeBarsLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'volume:bars';
  requiredInputKeys: RequiredInputKeys;
  series: {
    bars: null | DirectionalBarConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface VolumeBarsLayerConfig extends BaseLayerConfig {
  type: 'volume:bars';
  series?: {
    bars?: false | DirectionalBarConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface VolumeBarsTheme {
  series: {
    bars: DirectionalBarConfigComplete;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const volumeBarsDefaults: Omit<VolumeBarsLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'period' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'volume-bars-layer',
  defaultScale: { key: 'volume_positive', domain: 'volume', range: { type: 'positive' } },
  inputs: [
    { key: 'volume', source: { type: 'volume', field: 'volume' } },
  ],
  outputs: ['volume'],
  offset: 0,
  series: {
    bars: {
      up: { width: 0.6, backgroundColor: '#10b98177', borderColor: '#10b98177', borderWidth: 0 },
      down: { width: 0.6, backgroundColor: '#ef444477', borderColor: '#ef444477', borderWidth: 0 },
      flat: { width: 0.6, backgroundColor: '#ccc', borderColor: '#ccc', borderWidth: 0 },
    },
  },
  valueToY: (_min: number, max: number, top: number, height: number) => {
    const range = max;
    return (value: number) => top + ((max - value) / range) * height;
  },
  valueLabelFormatter: (value: number) => {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (abs < 1_000_000) {
      return `${value.toFixed(0)}`;
    }

    const suffixes = [
      { divisor: 1e12, symbol: 'T' },
      { divisor: 1e9, symbol: 'B' },
      { divisor: 1e6, symbol: 'M' },
    ];

    for (const { divisor, symbol } of suffixes) {
      if (abs >= divisor) {
        const scaled = abs / divisor;
        const formatted = scaled >= 100
          ? scaled.toFixed(0)
          : scaled >= 10
            ? scaled.toFixed(1)
            : scaled.toFixed(2);
        return `${sign}${formatted.replace(/\.?0+$/, '')}${symbol}`;
      }
    }

    return `${value.toFixed(0)}`;
  },
};
