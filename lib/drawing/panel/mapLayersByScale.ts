/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerScale } from '../../config/layer/BaseLayerConfig';
import { LayerConfigComplete } from '../../config/layer/LayerConfig';

const mapLayerByScale = (layerConfigs: LayerConfigComplete[], layerScalesByLayerId: Record<string, LayerScale>) => {

  const layersByScale = layerConfigs.reduce((acc, layer) => {
    const deducedScale = layerScalesByLayerId[layer.id];
    const scaleLayers = acc[deducedScale.key] || [];
    return {
      ...acc,
      [deducedScale.key]: [...scaleLayers, layer],
    };
  }, {} as Record<LayerScale['key'], LayerConfigComplete[]>);

  return layersByScale;

};

export default mapLayerByScale;
