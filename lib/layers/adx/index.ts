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
import { AdxLayerConfig, AdxLayerConfigComplete } from './AdxLayerConfig';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type {
  AdxLayerConfig,
  AdxLayerConfigComplete,
};

const adx = defineLayer<AdxLayerConfig, AdxLayerConfigComplete>({
  type: 'adx',
  displayName: 'ADXLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: onLayerElementHover,
  onClick: onLayerElementClick,
});

export default adx;
