/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface LayerMetrics {
  valueToY: (value: number) => number;
  min: number;
  max: number;
}
