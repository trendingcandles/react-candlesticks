/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerHitTestContext } from '../../config/layer/Layer';
import hitTestLineIndicator from '../../drawing/layer/hitTestLineIndicator';
import { SmaLayerConfigComplete } from './SmaLayerConfig';

const hitTest = (hitTestContext: LayerHitTestContext<SmaLayerConfigComplete>) => {
  const { layerConfig } = hitTestContext;

  return hitTestLineIndicator(hitTestContext, [
    {
      output: 'value',
      line: layerConfig.series?.value ?? null,
      barOffset: layerConfig.offset,
    },
  ]);
};

export default hitTest;
