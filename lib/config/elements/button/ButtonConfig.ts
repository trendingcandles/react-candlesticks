/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LabelConfig, LabelConfigComplete, labelDefaults, LabelTheme } from '../label/LabelConfig';

export interface ButtonConfigComplete extends LabelConfigComplete {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
}

export interface ButtonConfig extends LabelConfig {
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}

export interface ButtonTheme extends LabelTheme {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
}

export const buttonDefaults: ButtonConfigComplete = {
  ...labelDefaults,
  backgroundColor: '#e2e2e2e',
  borderColor: '#e2e2e2',
  borderWidth: 0,
  borderRadius: 4,
};

export const themeDefaultButton: ButtonTheme = {
  ...buttonDefaults,
};