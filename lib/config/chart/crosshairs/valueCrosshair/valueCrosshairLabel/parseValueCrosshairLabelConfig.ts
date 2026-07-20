/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseBoxedValueLabelConfig from '../../../../elements/boxedValueLabel/parseBoxedValueLabelConfig';
import { ValueCrosshairLabelConfig, ValueCrosshairLabelConfigComplete, valueCrosshairLabelDefaults, ValueCrosshairLabelTheme } from './ValueCrosshairLabelConfig';

const parseValueCrosshairLabelConfig = (
  partialConfig: false | ValueCrosshairLabelConfig = {},
  valueCrosshairLabelTheme: ValueCrosshairLabelTheme,
  backgroundColor?: string,
): null | ValueCrosshairLabelConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const labelTheme = {
    ...valueCrosshairLabelTheme,
    borderRadius: valueCrosshairLabelTheme.borderRadius ?? valueCrosshairLabelDefaults.borderRadius,
  };

  const valueLabelConfigComplete = parseBoxedValueLabelConfig(partialConfig, labelTheme);

  const boxedValueLabelConfigComplete: ValueCrosshairLabelConfigComplete = {
    ...valueCrosshairLabelDefaults,
    ...labelTheme,
    ...valueLabelConfigComplete,
    backgroundColor: partialConfig.backgroundColor ?? backgroundColor ?? valueCrosshairLabelTheme.backgroundColor ?? valueCrosshairLabelDefaults.backgroundColor,
    borderWidth: partialConfig.borderWidth ?? valueCrosshairLabelTheme.borderWidth ?? valueCrosshairLabelDefaults.borderWidth,
    borderColor: partialConfig.borderColor ?? valueCrosshairLabelTheme.borderColor ?? valueCrosshairLabelDefaults.borderColor,
    hPadding: partialConfig.hPadding ?? valueCrosshairLabelTheme.hPadding ?? valueCrosshairLabelDefaults.hPadding,
    vPadding: partialConfig.vPadding ?? valueCrosshairLabelTheme.vPadding ?? valueCrosshairLabelDefaults.vPadding,
    borderRadius: partialConfig.borderRadius ?? labelTheme.borderRadius ?? valueCrosshairLabelDefaults.borderRadius,
  };

  return boxedValueLabelConfigComplete;
};

export default parseValueCrosshairLabelConfig;
