/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import hitTestLineIndicator from '../../drawing/layer/hitTestLineIndicator';
import { StochasticLayerConfigComplete } from './StochasticLayerConfig';

const hitTest = (hitTestContext: LayerHitTestContext<StochasticLayerConfigComplete>) => {
  const { layerConfig } = hitTestContext;

  return hitTestLineIndicator(hitTestContext, [
    { output: 'd', line: layerConfig.series.d },
    { output: 'kSmoothed', line: layerConfig.series.k },
  ]);
};

export default hitTest;
