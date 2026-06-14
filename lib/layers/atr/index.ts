/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { AtrLayerConfig, AtrLayerConfigComplete } from './AtrLayerConfig';
import parse from './parse';
import calc from './calc';
import draw from './draw';
import Layer from '../../config/layer/Layer';

export type {
  AtrLayerConfig,
  AtrLayerConfigComplete,
};

const atr: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default atr;
