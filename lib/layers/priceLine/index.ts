/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import Layer from '../../config/layer/Layer';
import { PriceLineLayerConfig, PriceLineLayerConfigComplete } from './PriceLineLayerConfig';
import calc from './calc';
import draw from './draw';
import parse from './parse';

export type {
  PriceLineLayerConfig,
  PriceLineLayerConfigComplete,
};

const priceLine: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default priceLine;
