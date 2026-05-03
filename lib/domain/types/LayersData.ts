/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayersTopology } from '../../config/layer/createLayerTopology';
import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerType } from '../../config/layer/LayerType';

export interface LayerInputSeries {
  id: string; // 'close', 'hlc3', 'ema20.value', etc
  values: Float64Array;
}

export interface LayerDataInstance {
  id: string;
  layerType: LayerType;
  layerConfig: LayerConfigComplete;

  inputs: Record<string, LayerInputSeries>;
  outputValues: Record<string, Float64Array>;

  computedStartIndex: number;
  computedEndIndex: number;
}

export interface LayersData {
  layerDataInstances: Record<string, LayerDataInstance>;
  layersTopology: LayersTopology;
}
