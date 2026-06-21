/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import hitTestLineIndicator from '../../drawing/layer/hitTestLineIndicator';
import { AreaLayerConfigComplete } from './AreaLayerConfig';

const hitTest = (hitTestContext: LayerHitTestContext<AreaLayerConfigComplete>) => {
  const { layerConfig } = hitTestContext;

  return hitTestLineIndicator(hitTestContext, [
    { output: 'price', line: layerConfig.series.value.line },
  ]);
};

export default hitTest;
