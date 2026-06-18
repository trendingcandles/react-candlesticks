/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import defineLayer from '../defineLayer';
import calc from './calc';
import draw from './draw';
import { MacdLayerConfig, MacdLayerConfigComplete } from './MacdLayerConfig';
import parse from './parse';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type {
  MacdLayerConfig,
  MacdLayerConfigComplete,
};

const macd = defineLayer<MacdLayerConfig, MacdLayerConfigComplete>({
  type: 'macd',
  displayName: 'MACDLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default macd;
