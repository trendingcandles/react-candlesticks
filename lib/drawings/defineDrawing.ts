/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { FunctionComponent } from 'react';
import Drawing from '../config/drawing/Drawing';
import { DrawingConfig, DrawingConfigComplete } from '../config/drawing/DrawingConfig';
import DRAWING_COMPONENT_TYPE_KEY from '../config/drawing/drawingComponentTypeKey';

export type DrawingComponent<C extends DrawingConfig = DrawingConfig> =
  FunctionComponent<Omit<C, 'type'>>;

export interface DrawingDefinition<
  C extends DrawingConfig = DrawingConfig,
  Complete extends DrawingConfigComplete = DrawingConfigComplete,
> extends Drawing<C, Complete> {
  type: C['type'];
  Component: DrawingComponent<C>;
}

export type DefineDrawingOptions<
  C extends DrawingConfig,
  Complete extends DrawingConfigComplete,
> = Drawing<C, Complete> & {
  type: C['type'];
  displayName?: string;
};

export type CustomDrawingDefinition<
  C extends DrawingConfig = DrawingConfig,
  Complete extends DrawingConfigComplete = DrawingConfigComplete,
> = DrawingDefinition<C, Complete>;

const defineDrawing = <
  C extends DrawingConfig,
  Complete extends DrawingConfigComplete = DrawingConfigComplete,
>(
  options: DefineDrawingOptions<C, Complete>,
): DrawingDefinition<C, Complete> => {
  const {
    type,
    displayName = `${type}Drawing`,
    ...drawing
  } = options;

  if (!type) {
    throw new Error('Drawing type must be a non-empty string');
  }

  const Component = (() => null) as DrawingComponent<C> & {
    displayName?: string;
    [DRAWING_COMPONENT_TYPE_KEY]?: string;
  };

  Component.displayName = displayName;
  Component[DRAWING_COMPONENT_TYPE_KEY] = type;

  return {
    ...drawing,
    type,
    Component,
  } as DrawingDefinition<C, Complete>;
};

export default defineDrawing;
