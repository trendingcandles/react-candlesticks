/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { PriceLineLayerConfig } from './PriceLineLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PriceLineProps extends Omit<PriceLineLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PriceLineLayer = (_props: PriceLineProps) => {

  return null;

};

(PriceLineLayer as typeof PriceLineLayer & { layerType?: string }).layerType = 'price:line';
PriceLineLayer.displayName = 'PriceLineLayer';

export default PriceLineLayer;
