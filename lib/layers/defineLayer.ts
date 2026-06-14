/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { FunctionComponent } from 'react';
import Layer from '../config/layer/Layer';
import { BaseLayerConfig, BaseLayerConfigComplete } from '../config/layer/BaseLayerConfig';
import LAYER_COMPONENT_TYPE_KEY from '../config/layer/layerComponentTypeKey';

export type LayerComponent<C extends BaseLayerConfig = BaseLayerConfig> =
  FunctionComponent<Omit<C, 'type'>>;

export interface LayerDefinition<
  C extends BaseLayerConfig = BaseLayerConfig,
  Complete extends BaseLayerConfigComplete = BaseLayerConfigComplete,
> extends Layer<C, Complete> {
  type: C['type'];
  Component: LayerComponent<C>;
}

export type DefineLayerOptions<
  C extends BaseLayerConfig,
  Complete extends BaseLayerConfigComplete,
> = Layer<C, Complete> & {
  type: C['type'];
  displayName?: string;
};

export type LayerDefinitionConfig<D> =
  D extends LayerDefinition<infer C, BaseLayerConfigComplete> ? C : never;

export type LayerDefinitionConfigComplete<D> =
  D extends LayerDefinition<BaseLayerConfig, infer Complete> ? Complete : never;

export type CustomLayerComponent<C extends BaseLayerConfig = BaseLayerConfig> =
  LayerComponent<C>;

export type CustomLayerDefinition<
  C extends BaseLayerConfig = BaseLayerConfig,
  Complete extends BaseLayerConfigComplete = BaseLayerConfigComplete,
> = LayerDefinition<C, Complete>;

export type CustomLayerOptions<
  C extends BaseLayerConfig,
  Complete extends BaseLayerConfigComplete,
> = DefineLayerOptions<C, Complete>;

const defineLayer = <
  C extends BaseLayerConfig,
  Complete extends BaseLayerConfigComplete,
>(
  options: DefineLayerOptions<C, Complete>,
): LayerDefinition<C, Complete> => {
  const {
    type,
    displayName = `${type}Layer`,
    ...layer
  } = options;

  if (!type) {
    throw new Error('Layer type must be a non-empty string');
  }

  const Component = (() => null) as LayerComponent<C> & {
    displayName?: string;
    [LAYER_COMPONENT_TYPE_KEY]?: string;
  };

  Component.displayName = displayName;
  Component[LAYER_COMPONENT_TYPE_KEY] = type;

  return {
    ...layer,
    type,
    Component,
  } as LayerDefinition<C, Complete>;
};

export default defineLayer;
