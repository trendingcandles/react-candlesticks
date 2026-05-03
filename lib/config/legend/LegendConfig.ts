/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LabelConfig, LabelConfigComplete, themeDefaultLabel } from '../elements/label/LabelConfig';
import { LegendFieldConfig, LegendFieldConfigComplete, LegendFieldTheme } from './LegendFieldConfig';

export interface LegendConfigComplete extends LabelConfigComplete {
  left: number;
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  hPadding: number;
  vPadding: number;
  borderRadius: number;
  label: string;
  fields: LegendFieldConfigComplete[];
}

export interface LegendConfig extends LabelConfig {
  left?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  hPadding?: number;
  vPadding?: number;
  borderRadius?: number;
  label?: string;
  fields?: LegendFieldConfig[];
}

export interface LegendTheme extends Omit<LegendConfigComplete, 'fields'> {
  fields: LegendFieldTheme[];
}

export const legendDefaults: Pick<LegendConfigComplete, 'left' | 'hPadding' | 'vPadding' | 'backgroundColor' | 'borderWidth' | 'borderColor' | 'borderRadius' | 'label'> = {
  left: 16,
  hPadding: 8,
  vPadding: 6,
  backgroundColor: '#ffffff22',
  borderWidth: 1,
  borderColor: '#1a1a1a',
  borderRadius: 4,
  label: '',
};

export const themeDefaultLegend: Omit<LegendTheme, 'fields'> = {
  ...themeDefaultLabel,
  left: 12,
  backgroundColor: '#ffffff77',
  borderColor: 'transparent',
  borderWidth: 0,
  vPadding: 1,
  hPadding: 4,
  borderRadius: 0,
  label: '',
};
