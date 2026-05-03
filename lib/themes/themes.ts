/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import defaultLightTheme from './defaultLightTheme';
import defaultDarkTheme from './defaultDarkTheme';

import { Theme } from '../domain/types/Theme';

export type ThemeName = 'light' | 'dark';

const themes: Record<ThemeName, Theme> = {
  light: defaultLightTheme,
  dark: defaultDarkTheme,
};

export default themes;
