/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfig, LayerConfigComplete, LayersTheme } from './LayerConfig';
import parseLayerConfig from './parseLayerConfig';

// todo: tier variation: validate layer scales are same for layers on same panel
const parseLayerConfigs = (partialLayerConfigs: LayerConfig[], layersTheme: LayersTheme, panelId: string): LayerConfigComplete[] => {
  const layerConfigs = partialLayerConfigs.map(partialLayerConfig => parseLayerConfig(partialLayerConfig, layersTheme, panelId));
  const layerIds = layerConfigs.map(layer => layer.id);
  const duplicateLayerIds = layerIds.filter((id, index) => layerIds.indexOf(id) !== index);

  if (duplicateLayerIds.length > 0) {
    throw new Error(
      `Duplicate layer ids found in panel "${panelId}": ${[...new Set(duplicateLayerIds)].join(', ')}. ` +
      'Provide explicit unique layer ids when using the same indicator configuration multiple times.',
    );
  }

  return layerConfigs;
};

export default parseLayerConfigs;
