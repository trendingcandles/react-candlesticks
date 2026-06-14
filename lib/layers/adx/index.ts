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
import { AdxLayerConfig, AdxLayerConfigComplete } from './AdxLayerConfig';

export type {
  AdxLayerConfig,
  AdxLayerConfigComplete,
};

const adx: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default adx;
