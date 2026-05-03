/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import Layer from '../../config/layer/Layer';
import calc from './calc';
import { CandlestickLayerConfig, CandlestickLayerConfigComplete } from './CandlestickLayerConfig';
import draw from './draw/draw';
import parse from './parse';

export type {
  CandlestickLayerConfig,
  CandlestickLayerConfigComplete,
};

const candlesticks: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate2: calc,
  draw,
};

export default candlesticks;
