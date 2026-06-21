/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerInputSeries } from '../../domain/types/LayersData';
import { AreaLayerConfigComplete } from './AreaLayerConfig';

const calc = (
  layerConfig: AreaLayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  endBarIndex: number, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  outputValues.price = inputs.input.values;
};

export default calc;
