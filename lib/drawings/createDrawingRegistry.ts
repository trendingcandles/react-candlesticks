/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DrawingRegistry } from '../config/drawing/DrawingRegistry';
import { CustomDrawingDefinition } from './defineDrawing';

const createDrawingRegistry = (
  drawingDefinitions: readonly CustomDrawingDefinition[] = [],
): DrawingRegistry => {
  const registry: Record<string, DrawingRegistry[string]> = {};

  for (const drawingDefinition of drawingDefinitions) {
    if (registry[drawingDefinition.type]) {
      throw new Error(`Duplicate drawing type: ${drawingDefinition.type}`);
    }
    registry[drawingDefinition.type] = drawingDefinition;
  }

  return Object.freeze(registry);
};

export default createDrawingRegistry;
