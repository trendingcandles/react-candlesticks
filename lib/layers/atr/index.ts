/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { AtrLayerConfig, AtrLayerConfigComplete } from './AtrLayerConfig';
import parse from './parse';
import calc from './calc';
import draw from './draw';
import defineLayer from '../defineLayer';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type {
  AtrLayerConfig,
  AtrLayerConfigComplete,
};

const atr = defineLayer<AtrLayerConfig, AtrLayerConfigComplete>({
  type: 'atr',
  displayName: 'ATRLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default atr;
