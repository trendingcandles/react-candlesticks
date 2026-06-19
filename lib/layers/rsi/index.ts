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
import { RsiLayerConfig, RsiLayerConfigComplete } from './RsiLayerConfig';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type {
  RsiLayerConfig,
  RsiLayerConfigComplete,
};

const rsi = defineLayer<RsiLayerConfig, RsiLayerConfigComplete>({
  type: 'rsi',
  displayName: 'RSILayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default rsi;
