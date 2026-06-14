/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */ 

import React, {
  ReactElement,
  ReactNode,
  JSXElementConstructor,
  Children,
} from 'react';
import { PanelConfig } from '../../config/panel/PanelConfig';
import { LayerConfig } from '../../config/layer/LayerConfig';
import LAYER_COMPONENT_TYPE_KEY from '../../config/layer/layerComponentTypeKey';

export interface ConfigNode {
  type: string;
  props: Record<string, any>;
  children?: ConfigNode[];
}

export interface LayerConfigNode {
  props: Record<string, any>;
}

export interface PanelConfigNode {
  props: Record<string, any>;
  layers?: LayerConfigNode[];
}

interface LayerComponentMeta {
  displayName?: string;
  name?: string;
  layerType?: string;
  [LAYER_COMPONENT_TYPE_KEY]?: string;
}

export function mapLayerElementToConfig(element: ReactNode): LayerConfig | null {
  if (!React.isValidElement(element)) return null;

  const layerElement = element as ReactElement<
    any,
    string | JSXElementConstructor<any>
  >;

  const { type, props } = layerElement;

  let layerComponentName: string;
  let layerType: string | undefined;

  if (typeof type === 'string') {
    layerComponentName = type;
  } else {
    const maybeComponent = type as LayerComponentMeta;
    layerComponentName = maybeComponent.displayName || maybeComponent.name || 'Anonymous';
    layerType = maybeComponent[LAYER_COMPONENT_TYPE_KEY] ?? maybeComponent.layerType;
  }

  if (layerType === undefined) {
    throw new Error(`Invalid layer: ${layerComponentName}`);
  }

  const { children: _, ...cleanProps } = props;

  const layerConfig: LayerConfig = {
    ...cleanProps,
    type: layerType,
  };

  return layerConfig;
}

export function mapPanelElementsToConfig(element: ReactNode): PanelConfig | null {
  if (!React.isValidElement(element)) return null;

  const layerElement = element as ReactElement<
    any,
    string | JSXElementConstructor<any>
  >;

  const { type, props } = layerElement;

  const layerConfigs = React.Children.toArray(props.children)
    .map(mapLayerElementToConfig)
    .filter((child): child is LayerConfig => child !== null);

  let typeName: string;

  if (typeof type === 'string') {
    typeName = type;
  } else {
    const maybeComponent = type as { displayName?: string; name?: string };
    typeName = maybeComponent.displayName || maybeComponent.name || 'Anonymous';
  }

  const { children: _, ...cleanProps } = props;

  const panelConfig: PanelConfig = {
    ...cleanProps,
    layers: layerConfigs,
  };

  return panelConfig;
}

const parseConfigComponents = (chartChildElements: ReactNode): PanelConfig[] => {

  const panelConfigs = Children.toArray(chartChildElements)
    .map(mapPanelElementsToConfig)
    .filter(n => n !== null);

  return panelConfigs;

};

export default parseConfigComponents;
