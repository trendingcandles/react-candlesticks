/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { EmaLayerConfig } from './EmaLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EMALayerProps extends Omit<EmaLayerConfig, 'type'> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EMALayer = (_props: EMALayerProps) => {

  return null;

};

(EMALayer as typeof EMALayer & { layerType?: string }).layerType = 'ema';
EMALayer.displayName = 'EMALayer';

export default EMALayer;
