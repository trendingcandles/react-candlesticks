/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerRegistry } from '../config/layer/LayerRegistry';
import builtInLayers from './layers';
import { CustomLayerDefinition } from './defineLayer';

const createLayerRegistry = (
  layerDefinitions: readonly CustomLayerDefinition[] = [],
): LayerRegistry => {
  const registry: Record<string, LayerRegistry[string]> = {
    ...builtInLayers,
  };

  for (const layerDefinition of layerDefinitions) {
    if (registry[layerDefinition.type]) {
      throw new Error(`Duplicate layer type: ${layerDefinition.type}`);
    }
    registry[layerDefinition.type] = layerDefinition;
  }

  return Object.freeze(registry);
};

export default createLayerRegistry;
