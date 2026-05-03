/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLabelConfig from '../label/parseLabelConfig';
import { ButtonConfig, ButtonConfigComplete, buttonDefaults, ButtonTheme } from './ButtonConfig';

const parseButtonConfig = (
  partialConfig: false | ButtonConfig = {},
  buttonTheme: ButtonTheme,
): null | ButtonConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const valueLabelConfigComplete = parseLabelConfig(partialConfig, buttonTheme);

  const buttonConfigComplete: ButtonConfigComplete = {
    ...buttonDefaults,
    ...buttonTheme,
    ...valueLabelConfigComplete,
    backgroundColor: partialConfig.backgroundColor ?? buttonTheme.backgroundColor ?? buttonDefaults.backgroundColor,
    borderWidth: partialConfig.borderWidth ?? buttonTheme.borderWidth ?? buttonDefaults.borderWidth,
    borderColor: partialConfig.borderColor ?? buttonTheme.borderColor ?? buttonDefaults.borderColor,
    borderRadius: partialConfig.borderRadius ?? buttonTheme.borderRadius ?? buttonDefaults.borderRadius,
  };

  return buttonConfigComplete;
};

export default parseButtonConfig;
