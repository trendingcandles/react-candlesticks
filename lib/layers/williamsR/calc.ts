/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import { WilliamsRLayerConfigComplete } from './WilliamsRLayerConfig';

const calc = (
  layerConfig: LayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {
  const { length } = layerConfig as WilliamsRLayerConfigComplete;
  const highs = inputs.high.values;
  const lows = inputs.low.values;
  const closes = inputs.close.values;
  const values = outputValues.value;

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    let count = 0;

    for (let i = 0; i < length; i++) {
      const high = highs[barIndex - i];
      const low = lows[barIndex - i];
      if (!Number.isNaN(high) && !Number.isNaN(low)) {
        highestHigh = Math.max(highestHigh, high);
        lowestLow = Math.min(lowestLow, low);
        count++;
      }
    }

    const close = closes[barIndex];
    if (count === length && !Number.isNaN(close)) {
      const range = highestHigh - lowestLow;
      values[barIndex] = range === 0 ? 0 : ((highestHigh - close) / range) * -100;
    }
  }
};

export default calc;
