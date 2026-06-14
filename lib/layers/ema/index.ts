/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parse from './parse';
import { EmaLayerConfig, EmaLayerConfigComplete } from './EmaLayerConfig';
import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';

export type {
  EmaLayerConfig,
  EmaLayerConfigComplete,
};

const ema = defineLayer<EmaLayerConfig, EmaLayerConfigComplete>({
  type: 'ema',
  displayName: 'EMALayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default ema;
