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
import { OhlcBarsLayerConfig, OhlcBarsLayerConfigComplete } from './OhlcBarsLayerConfig';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type {
  OhlcBarsLayerConfig,
  OhlcBarsLayerConfigComplete,
};

const ohlcBars = defineLayer<OhlcBarsLayerConfig, OhlcBarsLayerConfigComplete>({
  type: 'price:ohlc-bars',
  displayName: 'OhlcBarsLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: (hit, hitTestContext) => {
    onLayerElementHover(hit, hitTestContext);
    const { layerConfig } = hitTestContext;
    layerConfig.onBarHover?.(hit);
  },
  onClick: (hit, hitTestContext) => {
    onLayerElementClick(hit, hitTestContext);
    const { layerConfig } = hitTestContext;
    layerConfig.onBarClick?.(hit);
  },
});

export default ohlcBars;
