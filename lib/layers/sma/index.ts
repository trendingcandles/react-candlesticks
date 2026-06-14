/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import Layer from '../../config/layer/Layer';
import calc from './calc';
import draw from './draw';
import parse from './parse';
import { SmaLayerConfig, SmaLayerConfigComplete } from './SmaLayerConfig';

export type {
  SmaLayerConfig,
  SmaLayerConfigComplete,
};

const sma: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default sma;
