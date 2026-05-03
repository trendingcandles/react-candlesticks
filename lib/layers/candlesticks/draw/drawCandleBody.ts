/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { CandlestickLayerConfigComplete } from '../CandlestickLayerConfig';

const drawCandleBody = (
  context: CanvasRenderingContext2D,
  candlestickslayerConfig: CandlestickLayerConfigComplete,
  variantKey: 'up' | 'down' | 'flat',
  x: number,
  openY: number,
  closeY: number,
  intervalWidthPx: number,
) => {

  const {
    series: {
      body,
    },
  } = candlestickslayerConfig;

  if (!body) return;

  const widthRatio = body[variantKey].width;
  const borderWidth = body[variantKey].borderWidth;
  const backgroundColor = body[variantKey].backgroundColor;
  const borderColor = body[variantKey].borderColor;

  const bodyTop = Math.round(Math.min(openY, closeY));
  const bodyHeight = Math.round(Math.abs(closeY - openY));
  
  // Calculate body width and force it to be odd for exact wick centering
  let bodyWidth = Math.round(intervalWidthPx * widthRatio);
  if (bodyWidth % 2 === 0) {
    bodyWidth += 1;  // Force odd width
  }

  // Center the body on the wick position: Math.round(x) + 0.5
  const wickCenterX = Math.round(x) + 0.5;
  const bodyLeft = Math.round(wickCenterX - bodyWidth / 2);

  if (bodyHeight > 0) {
    if (borderWidth > 0 && borderColor) {
      // Draw outer border fill
      context.fillStyle = borderColor;
      context.fillRect(bodyLeft, bodyTop, bodyWidth, bodyHeight);
      
      // Draw inner fill
      const innerLeft = bodyLeft + borderWidth;
      const innerTop = bodyTop + borderWidth;
      const innerWidth = bodyWidth - (borderWidth * 2);
      const innerHeight = bodyHeight - (borderWidth * 2);
      
      if (innerWidth > 0 && innerHeight > 0) {
        context.fillStyle = backgroundColor;
        context.fillRect(innerLeft, innerTop, innerWidth, innerHeight);
      }
    } else {
      // No border - just fill the body
      context.fillStyle = backgroundColor;
      context.fillRect(bodyLeft, bodyTop, bodyWidth, bodyHeight);
    }
  } else {
    // Doji case - draw a horizontal line centered on the wick
    const lineY = bodyTop + 0.5;
    const lineStartX = wickCenterX - bodyWidth / 2;
    const lineEndX = wickCenterX + bodyWidth / 2;
    
    context.beginPath();
    context.moveTo(lineStartX, lineY);
    context.lineTo(lineEndX, lineY);
    context.stroke();
  }
};

export default drawCandleBody;
