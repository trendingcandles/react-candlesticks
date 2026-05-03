/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { SmaLayerConfig } from './SmaLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SMALayerProps extends Omit<SmaLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SMALayer = (_props: SMALayerProps) => {

  return null;

};

(SMALayer as typeof SMALayer & { layerType?: string }).layerType = 'sma';
SMALayer.displayName = 'SMALayer';

export default SMALayer;
