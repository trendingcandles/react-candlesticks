/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LegendConfig, LegendConfigComplete } from '../legend/LegendConfig';
import defaultValueLabelFormatter from '../elements/valueLabel/defaultValueLabelFormatter';
import { LayerType } from './LayerType';
import { YAxisConfig, YAxisConfigComplete } from './yAxis/YAxisConfig';

export type ScaleDomain =
  | 'price'
  | 'percent'
  | 'volume'
  | 'value';

export type ScaleRange =
  | { type: 'auto' }                 // min/max from data
  | { type: 'positive' }             // [0, max]
  | { type: 'bounded'; min: number; max: number }
  | { type: 'zero-centered' };       // symmetric around 0

export type LayerScale = {
  key: string;
  domain: ScaleDomain;
  range: ScaleRange;
};

// todo
export type ScalePolicy =
  | 'fixed'        // must use exactly this scale
  | 'expandable'   // can expand beyond defaults
  | 'derived';     // must follow input scale

export type PriceField = 'open' | 'high' | 'low' | 'close';

export type VolumeField = 'volume';

export type LayerOutputRef = {
  layerId: string;
  output: string;
};

// core
export type PriceInputSource = { key: string; source: { type: 'price'; field: PriceField; }; };
export type VolumeInputSource = { key: string; source: { type: 'volume'; field: VolumeField; }; };

export type InputSource = PriceInputSource | VolumeInputSource;

export type ValueToYFunction = (min: number, max: number, top: number, height: number) => (value: number) => number;

export interface BaseLayerConfigComplete {
  id: string;
  type: LayerType;
  indicator: boolean;
  defaultScale: LayerScale;
  scale: null | LayerScale;
  scalePolicy: ScalePolicy;
  valueGridLines?: number[];
  valueToY: ValueToYFunction;
  legend: null | LegendConfigComplete;
  yAxis: null | YAxisConfigComplete;
  valueLabelFormatter: (value: number) => string;

  // indicator layer fields
  requiredInputKeys: string[];
  inputs: InputSource[];
  outputs: string[];
  period: number;
  offset: number;
  lookback: number | ((period: number) => number);
  calculate: boolean;
  includeInAutoScale: boolean;
}

export interface BaseLayerConfig {
  id?: string;
  type: LayerType;
  scale?: LayerScale;
  inputs?: InputSource[];
  outputs?: string[];
  valueGridLines?: number[];
  valueToY?: ValueToYFunction;
  legend?: false | LegendConfig;
  yAxis?: false | YAxisConfig;
  valueLabelFormatter?: (value: number) => string;

  // indicator layer fields
  period?: number;
  lookback?: number | ((period: number) => number);
  calculate?: boolean;
  includeInAutoScale?: boolean;
}

export const baseLayerDefaults: Omit<BaseLayerConfigComplete, 'id' | 'type' | 'defaultScale' | 'scale' | 'scalePolicy' | 'requiredInputKeys' | 'period' | 'valueToY' | 'legend' | 'yAxis'> = {
  valueLabelFormatter: defaultValueLabelFormatter,
  indicator: false,
  inputs: [{ key: 'input', source: { type: 'price', field: 'close' } }],
  outputs: ['value'],
  offset: 0,
  lookback: (period: number) => period,
  calculate: true,
  includeInAutoScale: true,
};
