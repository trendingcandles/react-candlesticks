/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayersTopology } from '../../config/layer/createLayerTopology';
import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerDataInstance, LayersData } from '../../domain/types/LayersData';

const createLayerDataInstance = (layerConfig: LayerConfigComplete, barsLength: number): LayerDataInstance => {
  const outputValues = layerConfig.outputs.reduce((acc, outputKey) => {
    const values = new Float64Array(barsLength);
    values.fill(NaN);
    return {...acc, [outputKey]: values };
  }, {});

  return {
    id: layerConfig.id,
    layerType: layerConfig.type,
    layerConfig,
    inputs: {},
    outputValues,
    computedStartIndex: Infinity,
    computedEndIndex: -Infinity,
  };
};

export const createLayersData = (
  layers: LayerConfigComplete[],
  layersTopology: LayersTopology,
  barsLength: number,
): LayersData => {
  const layerDataInstances: Record<string, LayerDataInstance> = {};

  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    const layerConfig = layers[layerIndex];
    const newLayerDataInstance = createLayerDataInstance(layerConfig, barsLength);
    layerDataInstances[newLayerDataInstance.id] = newLayerDataInstance;
  }

  return {
    layerDataInstances,
    layersTopology,
  };
}
