/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { LineConfig, LineConfigComplete } from '../../config/elements/line/LineConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';
import { LayerInputField } from '../../config/layer/inputSourceShorthand';

type RequiredInputKeys = ['input'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['input'];

export interface BollingerBandsLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'bollinger-bands';
  requiredInputKeys: RequiredInputKeys;
  standardDeviations: number;
  offset: number;
  series: {
    middle: null | LineConfigComplete;
    upper: null | LineConfigComplete;
    lower: null | LineConfigComplete;
  };
  bands: {
    channel: null | {
      fillColor: string;
    };
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface BollingerBandsLayerConfig extends BaseLayerConfig {
  type: 'bollinger-bands';
  source?: LayerInputField;
  standardDeviations?: number;
  offset?: number;
  series?: {
    middle?: false | LineConfig;
    upper?: false | LineConfig;
    lower?: false | LineConfig;
  };
  bands?: {
    channel?: false | {
      fillColor?: string;
    };
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface BollingerBandsTheme {
  series: {
    middle: LineConfigComplete;
    upper: LineConfigComplete;
    lower: LineConfigComplete;
  };
  bands: {
    channel: {
      fillColor: string;
    };
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const bollingerBandsDefaults: Omit<BollingerBandsLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'bollinger-bands-layer',
  defaultScale: { key: 'price_auto', domain: 'price', range: { type: 'auto' } },
  indicator: true,
  inputs: [
    { key: 'input', source: { type: 'price', field: 'close' } }
  ],
  outputs: ['middle', 'upper', 'lower'],
  period: 20,
  lookback: (period: number) => period * 3,
  // dataPointValues: (_indicatorId?: string) => (dp: DataPoint) => [],
  valueToY: (min: number = 0, max: number = 100, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
  standardDeviations: 2,
  offset: 0,
  series: {
    middle: { color: '#1a1a1a', style: 'solid', width: 1 },
    upper: { color: '#1a1a1a', style: 'solid', width: 1 },
    lower: { color: '#1a1a1a', style: 'solid', width: 1 },
  },
  bands: {
    channel: {
      fillColor: 'rgba(0, 100, 200, 0.1)',
    },
  },
};
