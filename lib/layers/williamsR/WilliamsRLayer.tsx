/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { WilliamsRLayerConfig } from './WilliamsRLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WilliamsRLayerProps extends Omit<WilliamsRLayerConfig, 'type'> {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WilliamsRLayer = (_props: WilliamsRLayerProps) => null;

(WilliamsRLayer as typeof WilliamsRLayer & { layerType?: string }).layerType = 'williams-r';
WilliamsRLayer.displayName = 'WilliamsRLayer';

export default WilliamsRLayer;
