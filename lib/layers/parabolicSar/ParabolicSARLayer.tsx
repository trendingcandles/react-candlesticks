/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ParabolicSarLayerConfig } from './ParabolicSarLayerConfig';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ParabolicSARLayerProps extends Omit<ParabolicSarLayerConfig, 'type'> {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ParabolicSARLayer = (_props: ParabolicSARLayerProps) => null;

(ParabolicSARLayer as typeof ParabolicSARLayer & { layerType?: string }).layerType = 'parabolic-sar';
ParabolicSARLayer.displayName = 'ParabolicSARLayer';

export default ParabolicSARLayer;
