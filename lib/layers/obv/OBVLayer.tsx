/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ObvLayerConfig } from './ObvLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OBVLayerProps extends Omit<ObvLayerConfig, 'type'> {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OBVLayer = (_props: OBVLayerProps) => null;

(OBVLayer as typeof OBVLayer & { layerType?: string }).layerType = 'obv';
OBVLayer.displayName = 'OBVLayer';

export default OBVLayer;
