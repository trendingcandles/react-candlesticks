/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { AdxLayerConfig } from './AdxLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ADXLayerProps extends Omit<AdxLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ADXLayer = (_props: ADXLayerProps) => {
  return null;
};

(ADXLayer as typeof ADXLayer & { layerType?: string }).layerType = 'adx';
ADXLayer.displayName = 'ADXLayer';

export default ADXLayer;
