/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfig, BaseLayerConfigComplete } from './BaseLayerConfig';
import { BuiltInLayerDefinition } from '../../layers/builtInLayers';
import {
  LayerDefinitionConfig,
  LayerDefinitionConfigComplete,
} from '../../layers/defineLayer';

export type { LayersTheme } from './LayersTheme';

export interface CustomLayerConfig extends BaseLayerConfig {
  type: string;
  [key: string]: unknown;
}

export interface CustomLayerConfigComplete extends BaseLayerConfigComplete {
  type: string;
  [key: string]: unknown;
}

export type BuiltInLayerConfig =
  LayerDefinitionConfig<BuiltInLayerDefinition>;

export type BuiltInLayerConfigComplete =
  LayerDefinitionConfigComplete<BuiltInLayerDefinition>;

export type LayerConfig = BuiltInLayerConfig | CustomLayerConfig;

export type LayerConfigComplete =
  BuiltInLayerConfigComplete | CustomLayerConfigComplete;
