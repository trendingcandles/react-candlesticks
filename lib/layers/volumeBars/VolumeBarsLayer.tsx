/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { VolumeBarsLayerConfig } from './VolumeBarsLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VolumeBarsProps extends Omit<VolumeBarsLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VolumeBarsLayer = (_props: VolumeBarsProps) => {

  return null;

};

(VolumeBarsLayer as typeof VolumeBarsLayer & { layerType?: string }).layerType = 'volume:bars';
VolumeBarsLayer.displayName = 'VolumeBarsLayer';

export default VolumeBarsLayer;
