/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfigComplete, LayerScale } from '../../config/layer/BaseLayerConfig';

const mapLayerByScale = (layerConfigs: BaseLayerConfigComplete[], layerScalesByLayerId: Record<string, LayerScale>) => {

  const layersByScale = layerConfigs.reduce((acc, layer) => {
    const deducedScale = layerScalesByLayerId[layer.id];
    const scaleLayers = acc[deducedScale.key] || [];
    return {
      ...acc,
      [deducedScale.key]: [...scaleLayers, layer],
    };
  }, {} as Record<LayerScale['key'], BaseLayerConfigComplete[]>);

  return layersByScale;

};

export default mapLayerByScale;
