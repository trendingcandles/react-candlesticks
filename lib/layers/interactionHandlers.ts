/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BaseLayerConfigComplete } from '../config/layer/BaseLayerConfig';
import { LayerClickHandler, LayerHoverHandler } from '../config/layer/Layer';

export const onLayerElementHover: LayerHoverHandler<BaseLayerConfigComplete> = (hit, { layerConfig }) => {
  layerConfig.onElementHover?.(hit);
};

export const onLayerElementClick: LayerClickHandler<BaseLayerConfigComplete> = (hit, { layerConfig }) => {
  layerConfig.onElementClick?.(hit);
};
