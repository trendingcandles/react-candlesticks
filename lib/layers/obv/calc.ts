/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import { ObvLayerConfigComplete } from './ObvLayerConfig';

const calc = (
  layerConfig: LayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {
  const { smoothingLength } = layerConfig as ObvLayerConfigComplete;
  const prices = inputs.price.values;
  const volumes = inputs.volume.values;
  const values = outputValues.value;
  const smoothing = outputValues.smoothing;

  let obv = 0;

  for (let barIndex = 0; barIndex < endBarIndex; barIndex++) {
    const price = prices[barIndex];
    const previousPrice = prices[barIndex - 1];
    const volume = volumes[barIndex];
    if (Number.isNaN(price) || Number.isNaN(volume)) continue;

    if (!Number.isNaN(previousPrice)) {
      if (price > previousPrice) obv += volume;
      if (price < previousPrice) obv -= volume;
    }
    values[barIndex] = obv;

    let sum = 0;
    let count = 0;
    for (let i = 0; i < smoothingLength; i++) {
      const value = values[barIndex - i];
      if (!Number.isNaN(value)) {
        sum += value;
        count++;
      }
    }
    if (count === smoothingLength) smoothing[barIndex] = sum / smoothingLength;
  }
};

export default calc;
