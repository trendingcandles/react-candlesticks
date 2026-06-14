/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayersTopology } from '../../config/layer/createLayerTopology';
import { LayerRegistry } from '../../config/layer/LayerRegistry';
import { BaseLayerConfigComplete } from '../../config/layer/BaseLayerConfig';

export interface LayerInputSeries {
  id: string; // 'close', 'hlc3', 'ema20.value', etc
  values: Float64Array;
}

export interface LayerDataInstance {
  id: string;
  layerType: string;
  layerConfig: BaseLayerConfigComplete;

  inputs: Record<string, LayerInputSeries>;
  outputValues: Record<string, Float64Array>;

  computedStartIndex: number;
  computedEndIndex: number;
}

export interface LayersData {
  layerDataInstances: Record<string, LayerDataInstance>;
  layersTopology: LayersTopology;
  layerRegistry?: LayerRegistry;
}
