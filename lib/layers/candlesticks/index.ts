/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import defineLayer from '../defineLayer';
import calc from './calc';
import { CandlestickLayerConfig, CandlestickLayerConfigComplete } from './CandlestickLayerConfig';
import draw from './draw/draw';
import parse from './parse';
import hitTest from './hitTest';
import { onLayerElementClick, onLayerElementHover } from '../interactionHandlers';

export type {
  CandlestickLayerConfig,
  CandlestickLayerConfigComplete,
};

const candlesticks = defineLayer<CandlestickLayerConfig, CandlestickLayerConfigComplete>({
  type: 'price:candlesticks',
  displayName: 'CandlesticksLayer',
  parseConfig: parse,
  calculate: calc,
  draw,
  hitTest,
  onHover: (hit, hitTestContext) => {
    onLayerElementHover(hit, hitTestContext);
    const { layerConfig } = hitTestContext;
    layerConfig.onCandleHover?.(hit);
  },
  onClick: (hit, hitTestContext) => {
    onLayerElementClick(hit, hitTestContext);
    const { layerConfig } = hitTestContext;
    layerConfig.onCandleClick?.(hit);
  },
});

export default candlesticks;
