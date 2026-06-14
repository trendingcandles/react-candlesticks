/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export type { BuiltInLayerType } from '../../layers/builtInLayers';

import { BuiltInLayerType } from '../../layers/builtInLayers';

export type LayerType = BuiltInLayerType | (string & {});
