/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete, LineTheme } from '../../config/elements/line/LineConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme } from '../../config/valueMarker/ValueMarkerConfig';
import { BaseLayerConfig, BaseLayerConfigComplete, baseLayerDefaults } from '../../config/layer/BaseLayerConfig';
import { LegendTheme } from '../../config/legend/LegendConfig';
import { YAxisTheme } from '../../config/layer/yAxis/YAxisConfig';

type RequiredInputKeys = ['input'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['input'];

export interface AreaFillConfigComplete {
  topColor: string;
  bottomColor: string;
}

export interface AreaFillConfig {
  topColor?: string;
  bottomColor?: string;
}

export interface AreaLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'price:area';
  requiredInputKeys: RequiredInputKeys;
  offset: 0;
  series: {
    value: {
      line: null | LineConfigComplete;
      fill: null | AreaFillConfigComplete;
    };
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
}

export interface AreaLayerConfig extends BaseLayerConfig {
  type: 'price:area';
  series?: {
    value?: {
      line?: false | LineConfig;
      fill?: false | AreaFillConfig;
    };
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
}

export interface AreaTheme {
  series: {
    value: {
      line: LineTheme;
      fill: AreaFillConfigComplete;
    };
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const areaLayerDefaults: Omit<AreaLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'period' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'area-layer',
  defaultScale:{ key: 'price_auto', domain: 'price', range: { type: 'auto' } },
  inputs: [
    { key: 'input', source: { type: 'price', field: 'close' } },
  ],
  outputs: ['price'],
  offset: 0,
  series: {
    value: {
      line: { color: 'dodgerblue', width: 2, style: 'solid', endDotSize: 5 },
      fill: { topColor: '#1e90ff44', bottomColor: '#1e90ff00' },
    },
  },
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
};
