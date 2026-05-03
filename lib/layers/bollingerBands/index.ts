/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BollingerBandsLayerConfig, BollingerBandsLayerConfigComplete } from './BollingerBandsLayerConfig';
import parse from './parse';
import Layer from '../../config/layer/Layer';
import calc from './calc';
import draw from './draw';

export type {
  BollingerBandsLayerConfig,
  BollingerBandsLayerConfigComplete,
};

const bollingerBands: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate2: calc,
  draw,
};

export default bollingerBands;
