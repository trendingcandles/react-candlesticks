/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../../elements/line/parseLineConfig';
import { ValueCrosshairConfig, ValueCrosshairConfigComplete, ValueCrosshairTheme } from './ValueCrosshairConfig';
import parseValueCrosshairLabelConfig from './valueCrosshairLabel/parseValueCrosshairLabelConfig';

const parseValueCrosshairConfig = (partialConfig: false | ValueCrosshairConfig = {}, valueCrosshairTheme: ValueCrosshairTheme): null | ValueCrosshairConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const valueCrosshairComplete: ValueCrosshairConfigComplete = {
    line: parseLineConfig(partialConfig.line, valueCrosshairTheme.line),
    label: parseValueCrosshairLabelConfig(partialConfig.label, valueCrosshairTheme.label),
  };

  return valueCrosshairComplete;
};

export default parseValueCrosshairConfig;
