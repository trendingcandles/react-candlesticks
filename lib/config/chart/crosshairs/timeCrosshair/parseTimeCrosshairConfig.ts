/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import parseLineConfig from '../../../elements/line/parseLineConfig';
import { TimeCrosshairConfig, TimeCrosshairConfigComplete, TimeCrosshairTheme } from './TimeCrosshairConfig';
import parseTimeCrosshairLabelConfig from './timeCrosshairLabel/parseTimeCrosshairLabelConfig';

const parseTimeCrosshairConfig = (partialConfig: false | TimeCrosshairConfig = {}, timeCrosshairTheme: TimeCrosshairTheme): null | TimeCrosshairConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const timeCrosshairComplete: TimeCrosshairConfigComplete = {
    line: parseLineConfig(partialConfig.line, timeCrosshairTheme.line),
    label: parseTimeCrosshairLabelConfig(partialConfig.label, timeCrosshairTheme.label),
  };

  return timeCrosshairComplete;
};

export default parseTimeCrosshairConfig;
