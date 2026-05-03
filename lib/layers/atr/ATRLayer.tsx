/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { AtrLayerConfig } from './AtrLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ATRLayerProps extends Omit<AtrLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ATRLayer = (_props: ATRLayerProps) => {

  return null;

};

(ATRLayer as typeof ATRLayer & { layerType?: string }).layerType = 'atr';
ATRLayer.displayName = 'ATRLayer';

export default ATRLayer;
