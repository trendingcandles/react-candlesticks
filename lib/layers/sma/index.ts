/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { SmaLayerConfig, SmaLayerConfigComplete } from './SmaLayerConfig';

export type {
  SmaLayerConfig,
  SmaLayerConfigComplete,
};

const sma = defineLayer<SmaLayerConfig, SmaLayerConfigComplete>({
  type: 'sma',
  displayName: 'SMALayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default sma;
