/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';

const calc = (
  layerConfig: LayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  endBarIndex: number, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {

  const outputKey = 'price';

  outputValues[outputKey] = inputs.input.values;

};

export default calc;
