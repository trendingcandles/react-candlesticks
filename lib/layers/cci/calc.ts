/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { CciLayerConfigComplete } from './CciLayerConfig';

const calc = (
  layerConfig: CciLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {
  const { length, smoothingLength } = layerConfig;
  const highs = inputs.high.values;
  const lows = inputs.low.values;
  const closes = inputs.close.values;
  const values = outputValues.value;
  const smoothing = outputValues.smoothing;
  const typicalPrices = new Float64Array(endBarIndex);
  typicalPrices.fill(Number.NaN);

  for (let barIndex = Math.max(0, startBarIndex - length + 1); barIndex < endBarIndex; barIndex++) {
    if (!Number.isNaN(highs[barIndex]) && !Number.isNaN(lows[barIndex]) && !Number.isNaN(closes[barIndex])) {
      typicalPrices[barIndex] = (highs[barIndex] + lows[barIndex] + closes[barIndex]) / 3;
    }
  }

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < length; i++) {
      const value = typicalPrices[barIndex - i];
      if (!Number.isNaN(value)) {
        sum += value;
        count++;
      }
    }
    if (count !== length) continue;

    const average = sum / length;
    let deviationSum = 0;
    for (let i = 0; i < length; i++) {
      deviationSum += Math.abs(typicalPrices[barIndex - i] - average);
    }
    const meanDeviation = deviationSum / length;
    values[barIndex] = meanDeviation === 0
      ? 0
      : (typicalPrices[barIndex] - average) / (0.015 * meanDeviation);

    let smoothingSum = 0;
    let smoothingCount = 0;
    for (let i = 0; i < smoothingLength; i++) {
      const value = values[barIndex - i];
      if (!Number.isNaN(value)) {
        smoothingSum += value;
        smoothingCount++;
      }
    }
    if (smoothingCount === smoothingLength) smoothing[barIndex] = smoothingSum / smoothingLength;
  }
};

export default calc;
