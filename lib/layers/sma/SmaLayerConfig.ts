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
import { LayerInputField } from '../../config/layer/inputSourceShorthand';
import { LayerHit, LayerHitTestContext } from '../../config/layer/Layer';

type RequiredInputKeys = ['input'];
export const REQUIRED_INPUT_KEYS: RequiredInputKeys = ['input'];

export interface SmaLayerConfigComplete extends BaseLayerConfigComplete {
  type: 'sma';
  requiredInputKeys: RequiredInputKeys;
  offset: number;
  series: {
    value: null | LineConfigComplete;
  };
  markers: {
    value: null | ValueMarkerConfigComplete;
  };
  onLineHover?: (hit: LayerHit | null) => void;
  onLineClick?: (hit: LayerHit) => void;
}

export interface SmaLayerConfig extends BaseLayerConfig {
  type: 'sma';
  source?: LayerInputField;
  offset?: number;
  series?: {
    value?: false | LineConfig;
  };
  markers?: {
    value?: false | ValueMarkerConfig;
  };
  onLineHover?: (hit: LayerHit | null) => void;
  onLineClick?: (hit: LayerHit) => void;
}

export type SmaLayerHitTestContext = LayerHitTestContext<SmaLayerConfigComplete>;

export interface SmaTheme {
  series: {
    value: LineConfigComplete;
  };
  markers: {
    value: ValueMarkerTheme;
  };
  legend: LegendTheme;
  yAxis: YAxisTheme;
}

export const smaDefaults: Omit<SmaLayerConfigComplete, 'type' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'requiredInputKeys' | 'markers' | 'legend' | 'yAxis'> = {
  ...baseLayerDefaults,
  id: 'sma-layer',
  defaultScale: { key: 'price_auto', domain: 'price', range: { type: 'auto' } },
  period: 50,
  includeInAutoScale: false,
  indicator: true,
  inputs: [
    { key: 'input', source: { type: 'price', field: 'close' } },
  ],
  lookback: (period: number) => period,
  valueToY: (min: number, max: number, top: number, height: number) => {
    const range = max - min;
    return (value: number) => top + ((max - value) / range) * height;
  },
  offset: 0,
  series: {
    value: { color: 'orange', style: 'solid', width: 1 },
  },
};
