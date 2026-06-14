/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerRegistry } from '../config/layer/LayerRegistry';
import builtInLayers from './layers';
import { CustomLayerDefinition } from './defineLayer';
import Layer from '../config/layer/Layer';

const createLayerRegistry = (
  customLayers: readonly CustomLayerDefinition[] = [],
): LayerRegistry => {
  const registry: Record<string, LayerRegistry[string]> = {
    ...builtInLayers,
  };

  for (const customLayer of customLayers) {
    if (registry[customLayer.type]) {
      throw new Error(`Duplicate layer type: ${customLayer.type}`);
    }
    registry[customLayer.type] = customLayer as unknown as Layer;
  }

  return Object.freeze(registry);
};

export default createLayerRegistry;
