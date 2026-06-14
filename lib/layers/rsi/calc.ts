/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { RsiLayerConfigComplete } from './RsiLayerConfig';

const calc = (
  layerConfig: RsiLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {

  const rsiLayerConfig = layerConfig;

  const {
    period,
  } = rsiLayerConfig;

  const outputKey = 'value';

  const inputValues = inputs.input.values;

  // Use Maps to store only what we need
  const avgGain = new Map<number, number>();
  const avgLoss = new Map<number, number>();

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const currentValue = inputValues[barIndex];
    
    if (isNaN(currentValue)) continue;
    
    const prevBarIndex = barIndex - 1;
    const prevValue = inputValues[prevBarIndex];
    
    if (isNaN(prevValue)) continue;
    
    // Calculate price change
    const change = currentValue - prevValue;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    
    const prevAvgGain = avgGain.get(prevBarIndex);
    const prevAvgLoss = avgLoss.get(prevBarIndex);
    
    if (prevAvgGain !== undefined && !isNaN(prevAvgGain) && prevAvgGain !== 0 &&
        prevAvgLoss !== undefined && !isNaN(prevAvgLoss)) {
      // Use Wilder's smoothing method for subsequent values
      avgGain.set(barIndex, ((prevAvgGain * (period - 1)) + gain) / period);
      avgLoss.set(barIndex, ((prevAvgLoss * (period - 1)) + loss) / period);
    } else {
      // Calculate initial average gain and loss as simple averages
      let gainSum = 0;
      let lossSum = 0;
      let count = 0;
      
      for (let i = 1; i <= period; i++) {
        const lookbackBarIndex = barIndex - i + 1;
        const lookbackValue = inputValues[lookbackBarIndex];
        
        const lookbackPrevBarIndex = lookbackBarIndex - 1;
        const lookbackPrevValue = inputValues[lookbackPrevBarIndex];

        if (!isNaN(lookbackValue) && !isNaN(lookbackPrevValue)) {
          const priceChange = lookbackValue - lookbackPrevValue;
          if (priceChange > 0) {
            gainSum += priceChange;
          } else if (priceChange < 0) {
            lossSum += -priceChange;
          }
          count++;
        }
      }
      
      if (count === period) {
        avgGain.set(barIndex, gainSum / period);
        avgLoss.set(barIndex, lossSum / period);
      }
    }
    
    // Calculate RSI
    const currentAvgGain = avgGain.get(barIndex);
    const currentAvgLoss = avgLoss.get(barIndex);
    
    if (currentAvgGain !== undefined && !isNaN(currentAvgGain) &&
        currentAvgLoss !== undefined && !isNaN(currentAvgLoss)) {
      
      if (currentAvgLoss === 0) {
        // If no losses, RSI = 100
        outputValues[outputKey][barIndex] = 100;
      } else {
        const rs = currentAvgGain / currentAvgLoss;
        outputValues[outputKey][barIndex] = 100 - (100 / (1 + rs));
      }
    }
  }

};

export default calc;
