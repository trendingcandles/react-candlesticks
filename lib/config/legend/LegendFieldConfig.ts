/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export type LegendValueSource = Record<string, unknown>;
export type LegendValueSelector = (obj: LegendValueSource) => number | undefined;

export interface LegendFieldConfigComplete {
  output: string;
  label?: string;
  color: string;
  valueSelector: LegendValueSelector,
}

export interface LegendFieldConfig {
  output: string;
  label?: string;
  color?: string;
}

export interface LegendFieldTheme {
  output: string;
  color: string;
  label?: string;
}

export interface LegendFieldConfigDefaultsForLayer {
  output: string;
  label: string;
  color?: string;
  valueSelector: LegendValueSelector,
}

export const legendFieldDefaults: Omit<LegendFieldConfigComplete, 'output' | 'valueSelector'> = {
  color: '#1a1a1a',
};
