/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { BollingerBandsLayerConfigComplete } from './BollingerBandsLayerConfig';

const calc = (
  layerConfig: BollingerBandsLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {

  const bbLayerConfig = layerConfig;

  const {
    period = 20,
    standardDeviations = 2,
  } = bbLayerConfig;

  const middleOutputKey = 'middle';
  const lowerOutputKey = 'lower';
  const upperOutputKey = 'upper';

  const inputValues = inputs.input.values;

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    let sum = 0;
    let count = 0;
    const values: number[] = [];

    // First pass: collect values and calculate sum for SMA (middle band)
    for (let i = 0; i < period; i++) {
      const lookbackBarIndex = barIndex - i;
      const value = inputValues[lookbackBarIndex];
      
      if (!isNaN(value)) {
        values.push(value);
        sum += value;
        count++;
      }
    }

    // Only calculate if we have the full period
    if (count === period) {
      // Calculate middle band (SMA)
      const sma = sum / period;
      outputValues[middleOutputKey][barIndex] = sma;

      // Calculate standard deviation
      let squaredDiffSum = 0;
      for (let i = 0; i < values.length; i++) {
        const diff = values[i] - sma;
        squaredDiffSum += diff * diff;
      }
      const variance = squaredDiffSum / period;
      const stdDev = Math.sqrt(variance);

      // Calculate upper and lower bands
      const offset = stdDev * standardDeviations;
      outputValues[upperOutputKey][barIndex] = sma + offset;
      outputValues[lowerOutputKey][barIndex] = sma - offset;
    }
  }

};

export default calc;
