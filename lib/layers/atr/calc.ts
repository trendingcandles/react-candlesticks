/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { AtrLayerConfigComplete } from './AtrLayerConfig';

const calc = (
  layerConfig: AtrLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {

  const atrLayerConfig = layerConfig;

  const {
    period,
  } = atrLayerConfig;

  const outputKey = 'value';

  const highs = inputs.high.values;
  const lows = inputs.low.values;
  const closes = inputs.close.values;
  
  const trValues = new Map<number, number>();
  
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    if (isNaN(closes[barIndex])) continue;
    
    const currentHigh = highs[barIndex];
    const currentLow = lows[barIndex];
    const previousClose = closes[barIndex - 1];
    
    if (!isNaN(previousClose)) {
      const highLow = currentHigh - currentLow;
      const highPrevClose = Math.abs(currentHigh - previousClose);
      const lowPrevClose = Math.abs(currentLow - previousClose);
      
      trValues.set(barIndex, Math.max(highLow, highPrevClose, lowPrevClose));
    } else {
      trValues.set(barIndex, currentHigh - currentLow);
    }
  }
  
  // Second pass: calculate ATR using Wilder's smoothing method
  // First ATR = simple average of first 'period' TRs
  // Subsequent ATRs = ((prior ATR × (period - 1)) + current TR) / period
  
  // Second pass: calculate ATR using Wilder's smoothing method
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const prevBarIndex = barIndex - 1;
    const prevAtr = outputValues[outputKey][prevBarIndex];
    
    if (prevAtr !== undefined && !isNaN(prevAtr)) {
      const currentTr = trValues.get(barIndex);
      if (currentTr !== undefined) {
        outputValues[outputKey][barIndex] = ((prevAtr * (period - 1)) + currentTr) / period;
      }
    } else {
      let sum = 0;
      let count = 0;
      
      for (let i = 0; i < period; i++) {
        const lookbackBarIndex = barIndex - i;
        const tr = trValues.get(lookbackBarIndex);
        
        if (tr !== undefined) {
          sum += tr;
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
