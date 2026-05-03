/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete, lineDefaults } from './LineConfig';

export interface  DirectionalLineConfigComplete {
  up: LineConfigComplete;
  down: LineConfigComplete;
  flat: LineConfigComplete;
}

export interface DirectionalLineConfig {
  up?: LineConfig;
  down?: LineConfig;
  flat?: LineConfig;
}

export type  DirectionalLineTheme = DirectionalLineConfigComplete;

export const directionalLineDefaults = {
  up: {
    ...lineDefaults,
    color: '#10b981',
  } as LineConfigComplete,
  down: {
    ...lineDefaults,
    color: '#ef4444',
  } as LineConfigComplete,
  flat: {
    ...lineDefaults,
    color: '#10b981',
  } as LineConfigComplete,
};
