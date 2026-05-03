/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import { EmaLayerConfigComplete } from './EmaLayerConfig';

const calc = (
  layerConfig: LayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {

  const emaLayerConfig: EmaLayerConfigComplete = layerConfig as EmaLayerConfigComplete;

  const {
    period,
  } = emaLayerConfig;

  const outputKey = 'value';

  const inputValues = inputs.input.values;

  // Calculate smoothing multiplier
  const multiplier = 2 / (period + 1);

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const currentValue = inputValues[barIndex];
    
    if (isNaN(currentValue)) continue;
    
    // const currentValue = currentBar[inputAttribute];
    const prevBarIndex = barIndex - 1;
    const prevEma = outputValues[outputKey][prevBarIndex];

    if (prevEma !== undefined && !isNaN(prevEma)) {
      // Use EMA formula: EMA = (Current × multiplier) + (Previous EMA × (1 - multiplier))
      outputValues[outputKey][barIndex] = (currentValue * multiplier) + (prevEma * (1 - multiplier));
    } else {
      // Calculate initial EMA as SMA of first 'period' values
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

      if (count === period) {
        outputValues[outputKey][barIndex] = sum / period;
      }
    }
  }

};

export default calc;
