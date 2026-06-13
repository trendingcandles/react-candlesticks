/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { CciLayerConfig } from './CciLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CCILayerProps extends Omit<CciLayerConfig, 'type'> {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CCILayer = (_props: CCILayerProps) => null;

(CCILayer as typeof CCILayer & { layerType?: string }).layerType = 'cci';
CCILayer.displayName = 'CCILayer';

export default CCILayer;
