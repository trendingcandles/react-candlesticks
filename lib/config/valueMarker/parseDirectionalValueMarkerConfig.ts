/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseValueMarkerConfig from './parseValueMarkerConfig';
import {
  DirectionalValueMarkerConfig,
  DirectionalValueMarkerConfigComplete,
  directionalValueMarkerDefaults,
  DirectionalValueMarkerTheme,
  themeDefaultDirectionalValueMarker,
} from './DirectionalValueMarkerConfig';
import { ValueMarkerConfigComplete, ValueMarkerTheme } from './ValueMarkerConfig';

const parseDirectionalValueMarkerConfig = (
  partialConfig: false | DirectionalValueMarkerConfig = {},
  defaults?: DirectionalValueMarkerTheme,
): null | DirectionalValueMarkerConfigComplete => {
  if (partialConfig === false) {
    return null;
  }
  const effectiveDefaults = defaults ?? themeDefaultDirectionalValueMarker;
  
  const showLine = partialConfig.showLine ?? directionalValueMarkerDefaults.showLine;
  const showLabel = partialConfig.showLabel ?? directionalValueMarkerDefaults.showLabel;

  const upDefaults: ValueMarkerTheme = {
    ...(effectiveDefaults.up),
  };

  const downDefaults: ValueMarkerTheme = {
    ...(effectiveDefaults.down),
  };

  const flatDefaults: ValueMarkerTheme= {
    ...(effectiveDefaults.flat),
  };

  // up
  const { line: upLine, label: upLabel }: ValueMarkerConfigComplete = parseValueMarkerConfig(
    partialConfig.up,
    upDefaults,
  )!;
  const up: Omit<ValueMarkerConfigComplete, 'mode'> = { line: upLine, label: upLabel };

  // down
  const { line: downLine, label: downLabel }: ValueMarkerConfigComplete = parseValueMarkerConfig(
    partialConfig.down,
    downDefaults,
  )!;
  const down: Omit<ValueMarkerConfigComplete, 'mode'> = { line: downLine, label: downLabel };

  // flat
  const { line: flatLine, label: flatLabel }: ValueMarkerConfigComplete = parseValueMarkerConfig(
    partialConfig.flat,
    flatDefaults,
  )!;
  const flat: Omit<ValueMarkerConfigComplete, 'mode'> = { line: flatLine, label: flatLabel };

  return {
    mode: partialConfig.mode ?? directionalValueMarkerDefaults.mode,
    showLine,
    showLabel,
    up,
    down,
    flat,
  };
};

export default parseDirectionalValueMarkerConfig;
