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
import hitTest from './hitTest';
import { AreaLayerConfig, AreaLayerConfigComplete } from './AreaLayerConfig';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type {
  AreaLayerConfig,
  AreaLayerConfigComplete,
};

const area = defineLayer<AreaLayerConfig, AreaLayerConfigComplete>({
  type: 'price:area',
  displayName: 'AreaLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default area;
