/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import { SmaLayerConfigComplete } from './SmaLayerConfig';

const calc = (
  layerConfig: LayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {

  const smaLayerConfig: SmaLayerConfigComplete = layerConfig as SmaLayerConfigComplete;
  
  const {
    period,
  } = smaLayerConfig;

  const outputKey = 'value';
  
  const inputValues = inputs.input.values;

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < period; i++) {
      const lookbackBarIndex = barIndex - i;
      const lookbackValue = inputValues[lookbackBarIndex];

      if (!isNaN(lookbackValue)) {
        sum += lookbackValue;
        count++;
      }
    }
    
    // Only set output if we have all required data points
    if (count === period) {
      outputValues[outputKey][barIndex] = sum / period;
    }
  }

};

export default calc;
