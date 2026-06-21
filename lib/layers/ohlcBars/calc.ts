/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { OhlcBarsLayerConfigComplete } from './OhlcBarsLayerConfig';

const calc = (
  layerConfig: OhlcBarsLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  endBarIndex: number, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  outputValues.open = inputs.open.values;
  outputValues.high = inputs.high.values;
  outputValues.low = inputs.low.values;
  outputValues.close = inputs.close.values;
};

export default calc;
