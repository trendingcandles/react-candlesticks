/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import defineLayer from '../defineLayer';
import calc from './calc';
import { CandlestickLayerConfig, CandlestickLayerConfigComplete } from './CandlestickLayerConfig';
import draw from './draw/draw';
import parse from './parse';

export type {
  CandlestickLayerConfig,
  CandlestickLayerConfigComplete,
};

const candlesticks = defineLayer<CandlestickLayerConfig, CandlestickLayerConfigComplete>({
  type: 'price:candlesticks',
  displayName: 'CandlesticksLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default candlesticks;
