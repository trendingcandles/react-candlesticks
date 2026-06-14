/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ComponentType } from 'react';
import Layer from '../config/layer/Layer';
import { CustomLayerConfig, CustomLayerConfigComplete } from '../config/layer/LayerConfig';
import LAYER_COMPONENT_TYPE_KEY from '../config/layer/layerComponentTypeKey';

export type CustomLayerComponent<C extends CustomLayerConfig = CustomLayerConfig> =
  ComponentType<Omit<C, 'type'>>;

export interface CustomLayerDefinition<
  C extends CustomLayerConfig = CustomLayerConfig,
  Complete extends CustomLayerConfigComplete = CustomLayerConfigComplete,
> extends Layer<C, Complete> {
  type: C['type'];
  Component: CustomLayerComponent<C>;
}

export type CustomLayerOptions<
  C extends CustomLayerConfig,
  Complete extends CustomLayerConfigComplete,
> = Layer<C, Complete> & {
  type: C['type'];
  displayName?: string;
};

const defineLayer = <
  C extends CustomLayerConfig,
  Complete extends CustomLayerConfigComplete,
>(
  options: CustomLayerOptions<C, Complete>,
): CustomLayerDefinition<C, Complete> => {
  const {
    type,
    displayName = `${type}Layer`,
    ...layer
  } = options;

  if (!type) {
    throw new Error('Custom layer type must be a non-empty string');
  }

  const Component = (() => null) as CustomLayerComponent<C> & {
    displayName?: string;
    [LAYER_COMPONENT_TYPE_KEY]?: string;
  };

  Component.displayName = displayName;
  Component[LAYER_COMPONENT_TYPE_KEY] = type;

  return {
    ...layer,
    type,
    Component,
  } as CustomLayerDefinition<C, Complete>;
};

export default defineLayer;
