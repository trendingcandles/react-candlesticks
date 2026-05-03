/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete } from '../../elements/line/LineConfig';

export interface GridConfigComplete {
  time: null | LineConfigComplete;
  value: null | LineConfigComplete;
}

export interface GridConfig {
  time?: false | LineConfig;
  value?: false | LineConfig;
}

export interface GridTheme {
  time: LineConfigComplete;
  value: LineConfigComplete;
}
