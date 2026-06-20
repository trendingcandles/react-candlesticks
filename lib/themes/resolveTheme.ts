/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { BarTheme } from '../config/elements/bar/BarConfig';
import { LineTheme } from '../config/elements/line/LineConfig';
import { ValueMarkerTheme } from '../config/valueMarker/ValueMarkerConfig';
import { DeepPartial, IndicatorThemeInput, Theme, ThemeComplete } from '../domain/types/Theme';
import defaultDarkTheme from './defaultDarkTheme';
import defaultLightTheme from './defaultLightTheme';

const INDICATOR_LAYER_KEYS = [
  'adx',
  'atr',
  'bollingerBands',
  'cci',
  'ema',
  'macd',
  'obv',
  'parabolicSar',
  'rsi',
  'sma',
  'stochastic',
  'williamsR',
] as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const clone = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map(item => clone(item)) as T;
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, clone(child)]),
    ) as T;
  }

  return value;
};

const mergeDeep = <T>(target: T, source: DeepPartial<T> | undefined): T => {
  if (source === undefined) {
    return target;
  }

  if (Array.isArray(source) || !isObject(source) || !isObject(target)) {
    return clone(source as T);
  }

  const result = { ...target } as Record<string, unknown>;

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = result[key];
    result[key] = isObject(targetValue) && isObject(sourceValue)
      ? mergeDeep(targetValue, sourceValue)
      : clone(sourceValue);
  }

  return result as T;
};

const isLineTheme = (value: unknown): value is LineTheme =>
  isObject(value) && typeof value.color === 'string' && typeof value.width === 'number' && typeof value.style === 'string';

const isBarTheme = (value: unknown): value is BarTheme =>
  isObject(value) && typeof value.backgroundColor === 'string' && typeof value.borderColor === 'string';

const isValueMarkerTheme = (value: unknown): value is ValueMarkerTheme =>
  isObject(value) && isObject(value.label);

const applyPaletteColor = (
  line: LineTheme,
  color: string,
  marker: ValueMarkerTheme | undefined,
  legendField: Record<string, unknown> | undefined,
) => {
  line.color = color;

  if (marker?.line) {
    marker.line.color = color;
  }

  if (marker?.label) {
    marker.label.backgroundColor = color;
    marker.label.borderColor = color;
  }

  if (legendField) {
    legendField.color = color;
  }
};

const applySemanticBarColors = (series: Record<string, unknown>, indicators: IndicatorThemeInput) => {
  for (const [key, value] of Object.entries(series)) {
    if (!isBarTheme(value)) {
      continue;
    }

    const lowerKey = key.toLowerCase();
    const color = lowerKey.includes('up')
      ? indicators.positiveColor
      : lowerKey.includes('down')
        ? indicators.negativeColor
        : lowerKey.includes('flat')
          ? indicators.neutralColor
          : undefined;

    if (!color) {
      continue;
    }

    value.backgroundColor = color;
    value.borderColor = color;
  }
};

const applyIndicatorOverrides = (theme: ThemeComplete, indicators?: IndicatorThemeInput): ThemeComplete => {
  if (!indicators) {
    return theme;
  }

  for (const layerKey of INDICATOR_LAYER_KEYS) {
    const layerTheme = theme.layers[layerKey] as unknown as Record<string, unknown>;
    const series = isObject(layerTheme.series) ? layerTheme.series : undefined;
    const markers = isObject(layerTheme.markers) ? layerTheme.markers : undefined;
    const legend = isObject(layerTheme.legend) ? layerTheme.legend : undefined;
    const legendFields = Array.isArray(legend?.fields) ? legend.fields : [];

    if (series) {
      let lineIndex = 0;

      for (const [output, seriesTheme] of Object.entries(series)) {
        if (!isLineTheme(seriesTheme)) {
          continue;
        }

        const marker = markers && isValueMarkerTheme(markers[output])
          ? markers[output] as ValueMarkerTheme
          : layerKey === 'bollingerBands' && output === 'middle' && markers && isValueMarkerTheme(markers.value)
            ? markers.value as ValueMarkerTheme
          : undefined;
        const legendField = legendFields.find(field =>
          isObject(field) && field.output === output,
        ) as Record<string, unknown> | undefined;
        const paletteColor = indicators.linePalette?.[lineIndex];

        if (paletteColor) {
          applyPaletteColor(seriesTheme, paletteColor, marker, legendField);
        }

        if (indicators.line) {
          series[output] = mergeDeep(seriesTheme, indicators.line);
        }

        lineIndex += 1;
      }

      applySemanticBarColors(series, indicators);
    }

    if (markers) {
      for (const [output, markerTheme] of Object.entries(markers)) {
        if (isValueMarkerTheme(markerTheme) && indicators.marker) {
          markers[output] = mergeDeep(markerTheme, indicators.marker);
        }
      }
    }

    if (legend && indicators.legend) {
      layerTheme.legend = mergeDeep(legend, indicators.legend);
    }

    if (isObject(layerTheme.yAxis) && indicators.yAxis) {
      layerTheme.yAxis = mergeDeep(layerTheme.yAxis, indicators.yAxis);
    }
  }

  return theme;
};

const stripThemeInputMetadata = (theme: Theme): DeepPartial<ThemeComplete> => {
  const themeOverrides: Record<string, unknown> = { ...theme };
  delete themeOverrides.base;
  delete themeOverrides.indicators;
  return themeOverrides;
};

const resolveTheme = (theme: Theme): ThemeComplete => {
  const baseTheme = theme.base === 'dark' ? defaultDarkTheme : defaultLightTheme;
  const withIndicatorOverrides = applyIndicatorOverrides(clone(baseTheme), theme.indicators);

  return mergeDeep<ThemeComplete>(withIndicatorOverrides, stripThemeInputMetadata(theme));
};

export default resolveTheme;
