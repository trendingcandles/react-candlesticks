/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerDataInstance } from '../../domain/types/LayersData';

const getIndicatorScalingValueArrays = (
  layerDataInstances: LayerDataInstance[],
): Float64Array[] => {

  const valueArrays: Float64Array[] = [];

  for (let i = 0; i < layerDataInstances.length; i++) {
    const layerDataInstance = layerDataInstances[i];
    const layerConfig = layerDataInstance.layerConfig;
    if (layerConfig.indicator) {
      if (layerConfig.includeInAutoScale) {
        for (const layerId in layerDataInstance.outputValues) {
          const values = layerDataInstance.outputValues[layerId];
          valueArrays.push(values);
        }
      }
    }
  }
  return valueArrays;

};

export default getIndicatorScalingValueArrays;
