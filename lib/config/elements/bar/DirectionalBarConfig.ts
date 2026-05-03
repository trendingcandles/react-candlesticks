/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BarConfig, BarConfigComplete, barDefaults } from './BarConfig';

export interface  DirectionalBarConfigComplete {
  up: BarConfigComplete;
  down: BarConfigComplete;
  flat: BarConfigComplete;
}

export interface DirectionalBarConfig {
  up?: BarConfig;
  down?: BarConfig;
  flat?: BarConfig;
}

export type DirectionalBarTheme = DirectionalBarConfigComplete;

export const directionalBarDefaults = {
  up: {
    ...barDefaults,
    color: '#10b981',
  } as BarConfigComplete,
  down: {
    ...barDefaults,
    color: '#ef4444',
  } as BarConfigComplete,
  flat: {
    ...barDefaults,
    color: '#10b981',
  } as BarConfigComplete,
};
