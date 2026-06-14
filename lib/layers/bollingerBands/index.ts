/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BollingerBandsLayerConfig, BollingerBandsLayerConfigComplete } from './BollingerBandsLayerConfig';
import parse from './parse';
import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';

export type {
  BollingerBandsLayerConfig,
  BollingerBandsLayerConfigComplete,
};

const bollingerBands = defineLayer<BollingerBandsLayerConfig, BollingerBandsLayerConfigComplete>({
  type: 'bollinger-bands',
  displayName: 'BollingerBandsLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
});

export default bollingerBands;
