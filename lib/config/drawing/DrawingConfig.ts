/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface DrawingConfig {
  id?: string;
  type: string;
  visible?: boolean;
  scaleKey?: string;
  [key: string]: unknown;
}

export interface DrawingConfigComplete extends DrawingConfig {
  id: string;
  type: string;
  visible: boolean;
}
