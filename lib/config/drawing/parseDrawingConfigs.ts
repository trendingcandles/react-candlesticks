/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { DrawingConfig, DrawingConfigComplete } from './DrawingConfig';
import { DrawingRegistry } from './DrawingRegistry';

const parseDrawingConfigs = (
  drawingConfigs: readonly DrawingConfig[] = [],
  panelId: string,
  drawingRegistry: DrawingRegistry = {},
): DrawingConfigComplete[] => {
  return drawingConfigs.map((drawingConfig, drawingIndex) => {
    const drawing = drawingRegistry[drawingConfig.type];
    if (!drawing) {
      throw new Error(`Unknown drawing type: ${drawingConfig.type}`);
    }

    if (drawing.parseConfig) {
      return drawing.parseConfig(drawingConfig, panelId, drawingIndex);
    }

    return {
      ...drawingConfig,
      id: drawingConfig.id ?? `${drawingConfig.type}_${panelId}_${drawingIndex}`,
      visible: drawingConfig.visible ?? true,
    };
  });
};

export default parseDrawingConfigs;
