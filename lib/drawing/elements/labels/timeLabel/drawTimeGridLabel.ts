/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { TimeLabelConfigComplete } from '../../../../config/elements/timeLabel/TimeLabelConfig';
import { TimeGridLine } from '../../../../domain/types/gridLine/TimeGridLine';

const drawTimeGridLabel = (
  context: CanvasRenderingContext2D,
  xAxisTop: number,
  x: number,
  gridLine: TimeGridLine,
  timestampMs: number,
  labelConfig: TimeLabelConfigComplete,
  timeZoneId: string | null,
) => {

  const {
    major,
    step: {
      unit,
    }
  } = gridLine; 

  const {
    top,
    color,
    fontFamily,
    fontSize,
    fontStyle,
    fontVariant,
    fontWeight,
    formatter,
  } = labelConfig;

  const y = xAxisTop + top;

  context.fillStyle = color;
  context.font =`${fontStyle} ${fontVariant} ${major ? 'bold' : fontWeight} ${fontSize}px ${fontFamily}`;
  context.textBaseline = 'top';
  context.textAlign = 'center';
  const labelText = formatter({
    utcTs: timestampMs,
    timeUnit: unit,
    kind: major ? 'major' : 'minor',
    timeZoneId: timeZoneId ?? undefined,
  });
  context.fillText(labelText, x, y);

};

export default drawTimeGridLabel;

