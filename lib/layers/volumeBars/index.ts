/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import Layer from '../../config/layer/Layer';
import { VolumeBarsLayerConfig, VolumeBarsLayerConfigComplete } from './VolumeBarsLayerConfig';
import calc from './calc';
import draw from './draw/draw';
import parse from './parse';

export type {
  VolumeBarsLayerConfig,
  VolumeBarsLayerConfigComplete,
};

const volumeBars: Layer = {
  parseConfig: parse as Layer['parseConfig'],
  calculate: calc,
  draw,
};

export default volumeBars;
