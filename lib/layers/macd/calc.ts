/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { MacdLayerConfigComplete } from './MacdLayerConfig';

const calc = (
  layerConfig: MacdLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {

  const macdLayerConfig = layerConfig;

  const {
    fastPeriod: parsedFastPeriod,
    period: legacyFastPeriod = 12,
    slowPeriod = 26,
    signalPeriod = 9,
  } = macdLayerConfig;
  const fastPeriod = parsedFastPeriod ?? legacyFastPeriod;

  const macdOutputKey = 'macd';
  const signalOutputKey = 'signal';
  const histogramOutputKey = 'histogram';

  const inputValues = inputs.input.values;

  // Calculate smoothing multipliers for EMAs
  const fastMultiplier = 2 / (fastPeriod + 1);
  const slowMultiplier = 2 / (slowPeriod + 1);
  const signalMultiplier = 2 / (signalPeriod + 1);

  // Use Maps to store only what we need
  const fastEma = new Map<number, number>();
  const slowEma = new Map<number, number>();

  // First pass: Calculate Fast EMA
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const currentValue = inputValues[barIndex];

    if (isNaN(currentValue)) continue;

    const prevBarIndex = barIndex - 1;
    const prevFastEma = fastEma.get(prevBarIndex);

    if (prevFastEma !== undefined && !isNaN(prevFastEma) && prevFastEma !== 0) {
      fastEma.set(barIndex, (currentValue * fastMultiplier) + (prevFastEma * (1 - fastMultiplier)));
    } else {
      // Calculate initial Fast EMA as SMA
      let sum = 0;
      let count = 0;

      for (let i = 0; i < fastPeriod; i++) {
        const lookbackBarIndex = barIndex - i;
        const lookbackValue = inputValues[lookbackBarIndex];
        
        if (!isNaN(lookbackValue)) {
          sum += lookbackValue;
          count++;
        }
      }

      if (count === fastPeriod) {
        fastEma.set(barIndex, sum / fastPeriod);
      }
    }
  }

  // Second pass: Calculate Slow EMA
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const currentValue = inputValues[barIndex];
    
    if (isNaN(currentValue)) continue;
    
    const prevBarIndex = barIndex - 1;
    const prevSlowEma = slowEma.get(prevBarIndex);

    if (prevSlowEma !== undefined && !isNaN(prevSlowEma) && prevSlowEma !== 0) {
      slowEma.set(barIndex, (currentValue * slowMultiplier) + (prevSlowEma * (1 - slowMultiplier)));
    } else {
      // Calculate initial Slow EMA as SMA
      let sum = 0;
      let count = 0;

      for (let i = 0; i < slowPeriod; i++) {
        const lookbackBarIndex = barIndex - i;
        const lookbackValue = inputValues[lookbackBarIndex];
        
        if (!isNaN(lookbackValue)) {
          sum += lookbackValue;
          count++;
        }
      }

      if (count === slowPeriod) {
        slowEma.set(barIndex, sum / slowPeriod);
      }
    }
  }

  // Third pass: Calculate MACD Line (Fast EMA - Slow EMA)
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const fast = fastEma.get(barIndex);
    const slow = slowEma.get(barIndex);
    
    if (fast !== undefined && !isNaN(fast) && fast !== 0 &&
        slow !== undefined && !isNaN(slow) && slow !== 0) {
      outputValues[macdOutputKey][barIndex] = fast - slow;
    }
  }

  // Fourth pass: Calculate Signal Line (EMA of MACD)
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const currentMacd = outputValues[macdOutputKey][barIndex];
    
    if (currentMacd === undefined || isNaN(currentMacd)) continue;
    
    const prevBarIndex = barIndex - 1;
    const prevSignal = outputValues[signalOutputKey][prevBarIndex];

    if (prevSignal !== undefined && !isNaN(prevSignal) && prevSignal !== 0) {
      outputValues[signalOutputKey][barIndex] = (currentMacd * signalMultiplier) + (prevSignal * (1 - signalMultiplier));
    } else {
      // Calculate initial Signal Line as SMA of MACD values
      let sum = 0;
      let count = 0;

      for (let i = 0; i < signalPeriod; i++) {
        const lookbackBarIndex = barIndex - i;
        const macdValue = outputValues[macdOutputKey][lookbackBarIndex];
        
        if (macdValue !== undefined && !isNaN(macdValue)) {
          sum += macdValue;
          count++;
        }
      }

      if (count === signalPeriod) {
        outputValues[signalOutputKey][barIndex] = sum / signalPeriod;
      }
    }
  }

  // Fifth pass: Calculate Histogram (MACD - Signal)
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const macd = outputValues[macdOutputKey][barIndex];
    const signal = outputValues[signalOutputKey][barIndex];
    
    if (macd !== undefined && !isNaN(macd) && signal !== undefined && !isNaN(signal)) {
      outputValues[histogramOutputKey][barIndex] = macd - signal;
    }
  }

};

export default calc;
