/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LineConfig, LineConfigComplete, lineDefaults, LineTheme } from './LineConfig';
import { assertNonNegativeNumber } from '../../utils/validateNumber';

const parseLineConfig = (partialConfig: false | LineConfig = {}, lineTheme?: LineTheme, color?: string): null | LineConfigComplete => {
  if (partialConfig === false) {
    return null;
  }

  const width = assertNonNegativeNumber(
    partialConfig.width ?? lineTheme?.width ?? lineDefaults.width,
    'line.width',
  );
  const endDotSize = assertNonNegativeNumber(
    partialConfig.endDotSize ?? lineTheme?.endDotSize ?? lineDefaults.endDotSize,
    'line.endDotSize',
  );
  const dashes = partialConfig.dashes ?? lineTheme?.dashes ?? lineDefaults.dashes;

  for (const [index, dashSize] of dashes.entries()) {
    assertNonNegativeNumber(dashSize, `line.dashes[${index}]`);
  }
  
  return {
    color: partialConfig.color ?? color ?? lineTheme?.color ?? lineDefaults.color,
    style: partialConfig.style ?? lineTheme?.style ?? lineDefaults.style,
    width,
    dashes,
    endDotSize,
  };
};

export default parseLineConfig;
