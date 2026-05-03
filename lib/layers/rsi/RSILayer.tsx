/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { RsiLayerConfig } from './RsiLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RSILayerProps extends Omit<RsiLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RSILayer = (_props: RSILayerProps) => {

  return null;

};

(RSILayer as typeof RSILayer & { layerType?: string }).layerType = 'rsi';
RSILayer.displayName = 'RSILayer';

export default RSILayer;
