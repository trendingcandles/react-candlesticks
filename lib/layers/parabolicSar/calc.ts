/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import { ParabolicSarLayerConfigComplete } from './ParabolicSarLayerConfig';

const calc = (
  layerConfig: LayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {
  const { start, increment, maxValue } = layerConfig as ParabolicSarLayerConfigComplete;
  const highs = inputs.high.values;
  const lows = inputs.low.values;
  const values = outputValues.value;
  const calculationEndBarIndex = Math.min(endBarIndex, values.length);

  if (calculationEndBarIndex < 2) return;

  let firstIndex = 1;
  while (firstIndex < calculationEndBarIndex && (
    !Number.isFinite(highs[firstIndex - 1]) ||
    !Number.isFinite(lows[firstIndex - 1]) ||
    !Number.isFinite(highs[firstIndex]) ||
    !Number.isFinite(lows[firstIndex])
  )) {
    firstIndex++;
  }
  if (firstIndex >= calculationEndBarIndex) return;

  let rising = highs[firstIndex] >= highs[firstIndex - 1];
  let extremePoint = rising
    ? Math.max(highs[firstIndex - 1], highs[firstIndex])
    : Math.min(lows[firstIndex - 1], lows[firstIndex]);
  let acceleration = start;
  let sar = rising
    ? Math.min(lows[firstIndex - 1], lows[firstIndex])
    : Math.max(highs[firstIndex - 1], highs[firstIndex]);
  values[firstIndex] = sar;

  for (let barIndex = firstIndex + 1; barIndex < calculationEndBarIndex; barIndex++) {
    const high = highs[barIndex];
    const low = lows[barIndex];
    if (!Number.isFinite(high) || !Number.isFinite(low)) continue;

    sar += acceleration * (extremePoint - sar);

    if (rising) {
      sar = Math.min(sar, lows[barIndex - 1], lows[barIndex - 2]);
      if (low < sar) {
        rising = false;
        sar = extremePoint;
        extremePoint = low;
        acceleration = start;
      } else if (high > extremePoint) {
        extremePoint = high;
        acceleration = Math.min(maxValue, acceleration + increment);
      }
    } else {
      sar = Math.max(sar, highs[barIndex - 1], highs[barIndex - 2]);
      if (high > sar) {
        rising = true;
        sar = extremePoint;
        extremePoint = high;
        acceleration = start;
      } else if (low < extremePoint) {
        extremePoint = low;
        acceleration = Math.min(maxValue, acceleration + increment);
      }
    }

    values[barIndex] = sar;
  }
};

export default calc;
