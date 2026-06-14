/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerRegistry } from '../config/layer/LayerRegistry';
import builtInLayerDefinitions from './builtInLayers';

const layers = Object.freeze(Object.fromEntries(
  builtInLayerDefinitions.map(layer => [layer.type, layer]),
)) as LayerRegistry;

export default layers;
