/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseBoxedValueLabelConfig from '../elements/boxedValueLabel/parseBoxedValueLabelConfig';
import parseLineConfig from '../elements/line/parseLineConfig';
import { ValueMarkerConfig, ValueMarkerConfigComplete, valueMarkerDefaults, themeDefaultValueMarker, ValueMarkerTheme } from './ValueMarkerConfig';

const parseValueMarkerConfig = (partialConfig: false | ValueMarkerConfig = {}, valueMarkerTheme?: ValueMarkerTheme, color?: string): null | ValueMarkerConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const effectiveValueMarkerTheme = valueMarkerTheme ?? themeDefaultValueMarker;

  const lineConfigComplete = partialConfig.line ? parseLineConfig(partialConfig.line, effectiveValueMarkerTheme.line, color) : null;

  const valueMarkerConfigComplete: ValueMarkerConfigComplete = {
    mode: partialConfig.mode ?? valueMarkerDefaults.mode,
    line: lineConfigComplete,
    label: parseBoxedValueLabelConfig(partialConfig.label, effectiveValueMarkerTheme.label, color),
  };

  return valueMarkerConfigComplete;
};

export default parseValueMarkerConfig;
