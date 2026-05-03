/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BollingerBandsLayerConfig } from './BollingerBandsLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BollingerBandsLayerProps extends Omit<BollingerBandsLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BollingerBandsLayer = (_props: BollingerBandsLayerProps) => {

  return null;

};

(BollingerBandsLayer as typeof BollingerBandsLayer & { layerType?: string }).layerType = 'bollinger-bands';
BollingerBandsLayer.displayName = 'BollingerBandsLayer';

export default BollingerBandsLayer;
