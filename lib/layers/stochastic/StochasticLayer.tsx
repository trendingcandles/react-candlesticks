/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { StochasticLayerConfig } from './StochasticLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StochasticLayerProps extends Omit<StochasticLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StochasticLayer = (_props: StochasticLayerProps) => {

  return null;

};

(StochasticLayer as typeof StochasticLayer & { layerType?: string }).layerType = 'stochastic';
StochasticLayer.displayName = 'StochasticLayer';

export default StochasticLayer;
