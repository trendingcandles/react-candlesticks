/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ButtonConfig, ButtonConfigComplete, ButtonTheme } from '../../elements/button/ButtonConfig';

export interface PanelControlsConfigComplete {
  goToLatestButton: null | ButtonConfigComplete;
}

export interface PanelControlsConfig {
  goToLatestButton?: false | ButtonConfig;
}

export interface PanelControlsTheme {
  goToLatestButton: ButtonTheme;
}
