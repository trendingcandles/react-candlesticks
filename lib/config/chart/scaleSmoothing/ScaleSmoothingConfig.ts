/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface ScaleSmoothingConfig {
  enabled?: boolean;
  durationMs?: number;
  expandImmediate?: boolean;
}

export interface ScaleSmoothingConfigComplete {
  enabled: boolean;
  durationMs: number;
  expandImmediate: boolean;
}

export type ScaleSmoothingInput = boolean | ScaleSmoothingConfig;

export const scaleSmoothingDefaults: ScaleSmoothingConfigComplete = {
  enabled: false,
  durationMs: 160,
  expandImmediate: true,
};
