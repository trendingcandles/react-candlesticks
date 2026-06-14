/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { StochasticLayerConfigComplete } from './StochasticLayerConfig';

const calc = (
  layerConfig: StochasticLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {

  const stochasticLayerConfig = layerConfig;
  
  const {
    kPeriod: parsedKPeriod,
    period: legacyKPeriod,
    dPeriod,
    kSmoothing,
  } = stochasticLayerConfig;
  const kPeriod = parsedKPeriod ?? legacyKPeriod;

  const kOutputKey = 'k';
  const kSmoothedOutputKey = 'kSmoothed';
  const dOutputKey = 'd';

  const highs = inputs.high.values;
  const lows = inputs.low.values;
  const closes = inputs.close.values;

  // First pass: calculate raw %K
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    let lowestLow = Infinity;
    let highestHigh = -Infinity;
    let count = 0;

    const currentClose = closes[barIndex];

    // Find highest high and lowest low over kPeriod
    for (let i = 0; i < kPeriod; i++) {
      const lookbackBarIndex = barIndex - i;
      const lookbackHigh = highs[lookbackBarIndex];
      const lookbackLow = lows[lookbackBarIndex];
      
      if (!isNaN(lookbackHigh) && !isNaN(lookbackLow)) {
        if (lookbackHigh > highestHigh) highestHigh = lookbackHigh;
        if (lookbackLow < lowestLow) lowestLow = lookbackLow;
        count++;
      }
    }

    // Calculate %K if we have full period
    if (count === kPeriod) {
      if (!isNaN(currentClose) && highestHigh !== lowestLow) {
        const rawK = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
        outputValues[kOutputKey][barIndex] = rawK;
      }
    }
  }

  // Second pass: calculate smoothed %K (SMA of raw %K over kSmoothing period)
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    let sum = 0;
    let count = 0;

    for (let i = 0; i < kSmoothing; i++) {
      const lookbackBarIndex = barIndex - i;
      const rawK = outputValues[kOutputKey][lookbackBarIndex];
      
      if (rawK !== undefined && !isNaN(rawK)) {
        sum += rawK;
        count++;
      }
    }

    if (count === kSmoothing) {
      outputValues[kSmoothedOutputKey][barIndex] = sum / kSmoothing;
    }
  }

  // Third pass: calculate %D (SMA of smoothed %K over dPeriod)
  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    let sum = 0;
    let count = 0;

    for (let i = 0; i < dPeriod; i++) {
      const lookbackBarIndex = barIndex - i;
      const smoothedK = outputValues[kSmoothedOutputKey][lookbackBarIndex];
      
      if (smoothedK !== undefined && !isNaN(smoothedK)) {
        sum += smoothedK;
        count++;
      }
    }

    if (count === dPeriod) {
      outputValues[dOutputKey][barIndex] = sum / dPeriod;
    }
  }

}

export default calc;
