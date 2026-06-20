/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { assertPositiveNumber } from '../../utils/validateNumber';
import {
  ScaleSmoothingConfigComplete,
  ScaleSmoothingInput,
  scaleSmoothingDefaults,
} from './ScaleSmoothingConfig';

const parseScaleSmoothingConfig = (
  input: ScaleSmoothingInput | undefined,
): ScaleSmoothingConfigComplete => {
  if (input === true) {
    return {
      ...scaleSmoothingDefaults,
      enabled: true,
    };
  }

  if (input === false || input === undefined) {
    return {
      ...scaleSmoothingDefaults,
      enabled: false,
    };
  }

  return {
    enabled: input.enabled ?? true,
    durationMs: assertPositiveNumber(
      input.durationMs ?? scaleSmoothingDefaults.durationMs,
      'scaleSmoothing.durationMs',
    ),
    expandImmediate: input.expandImmediate ?? scaleSmoothingDefaults.expandImmediate,
  };
};

export default parseScaleSmoothingConfig;
