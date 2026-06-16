/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DrawingRegistry } from '../config/drawing/DrawingRegistry';
import { CustomDrawingDefinition } from './defineDrawing';

const createDrawingRegistry = (
  customDrawings: readonly CustomDrawingDefinition[] = [],
): DrawingRegistry => {
  const registry: Record<string, DrawingRegistry[string]> = {};

  for (const customDrawing of customDrawings) {
    if (registry[customDrawing.type]) {
      throw new Error(`Duplicate drawing type: ${customDrawing.type}`);
    }
    registry[customDrawing.type] = customDrawing;
  }

  return Object.freeze(registry);
};

export default createDrawingRegistry;
