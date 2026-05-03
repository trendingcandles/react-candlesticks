/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete, lineDefaults } from '../../elements/line/LineConfig';

export interface BordersConfigComplete {
  left: null | LineConfigComplete;
  right: null | LineConfigComplete;
  top: null | LineConfigComplete;
  bottom: null | LineConfigComplete;
}

export interface BordersConfig {
  left?: false | LineConfig;
  right?: false | LineConfig;
  top?: false | LineConfig;
  bottom?: false | LineConfig;
}

export interface BordersTheme {
  left: LineConfigComplete;
  right: LineConfigComplete;
  top: LineConfigComplete;
  bottom: LineConfigComplete;
}

export const bordersDefaults: BordersConfigComplete = {
  left: { ...lineDefaults, color: '#ddd' },
  right: { ...lineDefaults, color: '#ddd' },
  top: { ...lineDefaults, color: '#ddd' },
  bottom: { ...lineDefaults, color: '#ddd' },
};

export const themeDefaultBorders: BordersTheme = {
  left: { ...lineDefaults, color: '#ddd' },
  right: { ...lineDefaults, color: '#ddd' },
  top: { ...lineDefaults, color: '#ddd' },
  bottom: { ...lineDefaults, color: '#ddd' },
};
