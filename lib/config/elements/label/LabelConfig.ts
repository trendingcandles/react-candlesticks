/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { FontStyle, FontVariant, FontWeight } from './Font';

export interface LabelConfigComplete {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontVariant: FontVariant;
  fontStyle: FontStyle;
}

export interface LabelConfig {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  fontVariant?: FontVariant;
  fontStyle?: FontStyle;
}

export type LabelTheme = LabelConfigComplete;

export const labelDefaults: LabelConfigComplete = {
  color: '#555',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 13,
  fontWeight: 'normal' as FontWeight,
  fontVariant: 'normal' as FontVariant,
  fontStyle: 'normal' as FontStyle,
};

export const themeDefaultLabel = {
  ...labelDefaults,
};
