/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import defineLayer from '../defineLayer';
import { PriceLineLayerConfig, PriceLineLayerConfigComplete } from './PriceLineLayerConfig';
import calc from './calc';
import draw from './draw';
import parse from './parse';

export type {
  PriceLineLayerConfig,
  PriceLineLayerConfigComplete,
};

const priceLine = defineLayer<PriceLineLayerConfig, PriceLineLayerConfigComplete>({
  type: 'price:line',
  displayName: 'PriceLineLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default priceLine;
