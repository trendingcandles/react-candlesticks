/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { MacdLayerConfig } from './MacdLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MACDLayerProps extends Omit<MacdLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MACDLayer = (_props: MACDLayerProps) => {

  return null;

};

(MACDLayer as typeof MACDLayer & { layerType?: string }).layerType = 'macd';
MACDLayer.displayName = 'MACDLayer';

export default MACDLayer;
