/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ValueMarkerMode } from './ValueMarkerMode';
import { ValueMarkerConfig, ValueMarkerConfigComplete, ValueMarkerTheme, themeDefaultValueMarker } from './ValueMarkerConfig';

export interface DirectionalValueMarkerConfigComplete {
  mode: ValueMarkerMode;
  showLine: boolean;
  showLabel: boolean;
  up: Omit<ValueMarkerConfigComplete, 'mode'>;
  down: Omit<ValueMarkerConfigComplete, 'mode'>;
  flat: Omit<ValueMarkerConfigComplete, 'mode'>;
}

export interface DirectionalValueMarkerConfig {
  mode?: ValueMarkerMode;
  showLine?: boolean;
  showLabel?: boolean;
  up?: Omit<ValueMarkerConfig, 'mode'>;
  down?: Omit<ValueMarkerConfig, 'mode'>;
  flat?: Omit<ValueMarkerConfig, 'mode'>;
}

export interface DirectionalValueMarkerTheme {
  up: ValueMarkerTheme;
  down: ValueMarkerTheme;
  flat: ValueMarkerTheme;
}

export const directionalValueMarkerDefaults: Pick<DirectionalValueMarkerConfigComplete, 'mode' | 'showLine' | 'showLabel'> = {
  mode: 'last-visible',
  showLine: false,
  showLabel: true,
};

export const themeDefaultDirectionalValueMarker: DirectionalValueMarkerTheme = {
  up: {
    ...themeDefaultValueMarker,
  },
  down: {
    ...themeDefaultValueMarker,
  },
  flat: {
    ...themeDefaultValueMarker,
  },
};
