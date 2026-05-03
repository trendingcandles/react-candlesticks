/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { VolumeBarsLayerConfigComplete } from '../VolumeBarsLayerConfig';

const drawVolumeBar = (
  context: CanvasRenderingContext2D,
  volumeBarsLayerConfig: VolumeBarsLayerConfigComplete,
  variantKey: 'up' | 'down' | 'flat',
  x: number,
  barTop: number,
  barBottom: number,
  intervalWidthPx: number,
) => {

  const {
    series: {
      bars,
    },
  } = volumeBarsLayerConfig;

  if (!bars) return;

  const widthRatio = bars[variantKey].width;
  const borderWidth = bars[variantKey].borderWidth;
  const backgroundColor = bars[variantKey].backgroundColor;
  const borderColor = bars[variantKey].borderColor

  const barTopPx = Math.round(barTop);
  const barBottomPx = Math.round(barBottom);
  const barHeight = Math.round(barBottomPx - barTopPx);
  
  // Calculate body width and force it to be odd for exact centering
  let bodyWidth = Math.round(intervalWidthPx * widthRatio);
  if (bodyWidth % 2 === 0) {
    bodyWidth += 1;  // Force odd width
  }

  // Center the body on the same position as candlestick wick
  const centerX = Math.round(x);
  const bodyLeft = Math.round(centerX - bodyWidth / 2);

  if (barHeight > 0) {
    if (borderWidth > 0) {
      // Draw outer border fill
      context.fillStyle = borderColor; // outer rectangle is the border
      context.fillRect(bodyLeft, barTopPx, bodyWidth, barHeight);
      
      // Draw inner fill
      const innerLeft = bodyLeft + borderWidth;
      const innerTop = barTopPx + borderWidth;
      const innerWidth = bodyWidth - (borderWidth * 2);
      const innerHeight = barHeight - (borderWidth * 2);
      
      if (innerWidth > 0 && innerHeight > 0) {
        context.fillStyle = backgroundColor;
        context.fillRect(innerLeft, innerTop, innerWidth, innerHeight);
      }
    } else {
      // No border - just fill the bar
      context.fillStyle = backgroundColor;
      context.fillRect(bodyLeft, barTopPx, bodyWidth, barHeight);
    }
  }
};

export default drawVolumeBar;
