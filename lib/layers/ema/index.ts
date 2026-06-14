/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parse from './parse';
import { EmaLayerConfig, EmaLayerConfigComplete } from './EmaLayerConfig';
import Layer from '../../config/layer/Layer';
import calc from './calc';
import draw from './draw';

export type {
  EmaLayerConfig,
  EmaLayerConfigComplete,
};

const ema: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default ema;
