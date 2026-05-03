/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfig, LayerConfigComplete, LayersTheme } from './LayerConfig';
import layers from '../../layers/layers';
import { assertFiniteNumber, assertNonNegativeNumber, assertPositiveNumber } from '../utils/validateNumber';

const parseLayerConfig = (partialConfig: LayerConfig, layersTheme: LayersTheme, panelId: string): LayerConfigComplete => {
  if (partialConfig.period !== undefined) {
    assertPositiveNumber(partialConfig.period, `${partialConfig.type}.period`);
  }

  if (typeof partialConfig.lookback === 'number') {
    assertNonNegativeNumber(partialConfig.lookback, `${partialConfig.type}.lookback`);
  }

  if (partialConfig.valueGridLines) {
    for (const [index, value] of partialConfig.valueGridLines.entries()) {
      assertFiniteNumber(value, `${partialConfig.type}.valueGridLines[${index}]`);
    }
  }

  if (partialConfig.type in layers) {
    return layers[partialConfig.type].parseConfig(partialConfig, layersTheme, panelId) as LayerConfigComplete;
  } else {
    throw new Error(`Invalid layer type: ${partialConfig.type || 'unspecified'}`);
  }
};

export default parseLayerConfig;
