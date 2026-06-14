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
import { StochasticLayerConfig, StochasticLayerConfigComplete } from './StochasticLayerConfig';

export type {
  StochasticLayerConfig,
  StochasticLayerConfigComplete,
};

const stochastic = defineLayer<StochasticLayerConfig, StochasticLayerConfigComplete>({
  type: 'stochastic',
  displayName: 'StochasticLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default stochastic;
