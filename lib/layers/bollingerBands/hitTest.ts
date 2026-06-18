/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import hitTestLineIndicator from '../../drawing/layer/hitTestLineIndicator';
import { BollingerBandsLayerConfigComplete } from './BollingerBandsLayerConfig';

const hitTest = (hitTestContext: LayerHitTestContext<BollingerBandsLayerConfigComplete>) => {
  const { layerConfig } = hitTestContext;

  return hitTestLineIndicator(hitTestContext, [
    {
      output: 'upper',
      line: layerConfig.series.upper,
      barOffset: layerConfig.offset,
    },
    {
      output: 'middle',
      line: layerConfig.series.middle,
      barOffset: layerConfig.offset,
    },
    {
      output: 'lower',
      line: layerConfig.series.lower,
      barOffset: layerConfig.offset,
    },
  ]);
};

export default hitTest;
