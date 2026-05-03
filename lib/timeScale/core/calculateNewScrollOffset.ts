/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { IndexProvider } from '../../domain/types/IndexProvider';

function calculateNewScrollOffset(
  currentScrollOffset: number,
  deltaX: number,
  indexToTimestamp: IndexProvider['indexToTimestamp'],
  findClosestIndex: IndexProvider['findClosestIndex'],
  intervalSize: number,
  viewportWidth: number,
  previousIntervalSize?: number,
  isGranularityChange?: boolean,
  minScrollOffset?: number,
  maxScrollOffset?: number,
): number {

  let newScrollOffset = currentScrollOffset;

  if (isGranularityChange) {
    // Find current center candle index in the old granularity
    const centerX = viewportWidth / 2;
    const absoluteCenterX = currentScrollOffset + centerX;
    const centerIndex = Math.round(absoluteCenterX / (previousIntervalSize || intervalSize));
    
    const centerTimestamp = indexToTimestamp(centerIndex) ?? 0;
            const closestIndex = findClosestIndex(centerTimestamp);
        
    // Set newScrollOffset so the new center index is at the center of viewport
    const newAbsoluteCenterX = closestIndex * intervalSize;
    newScrollOffset = newAbsoluteCenterX - centerX;
  }

  // Handle interval size change - keep center candle centered
  else if (previousIntervalSize !== undefined && previousIntervalSize !== intervalSize) {
    const centerX = viewportWidth / 2;
    const absoluteCenterX = currentScrollOffset + centerX;
    const centerIndex = Math.round(absoluteCenterX / previousIntervalSize);
    const newAbsoluteCenterX = centerIndex * intervalSize;
    newScrollOffset = newAbsoluteCenterX - centerX;
  }

  // Apply the delta
  newScrollOffset = newScrollOffset + deltaX;
  
  // Clamp to boundaries
  if (minScrollOffset !== undefined && maxScrollOffset !== undefined) {
    newScrollOffset = Math.max(minScrollOffset, Math.min(newScrollOffset, maxScrollOffset));
  }

  return Math.round(newScrollOffset);
}

export default calculateNewScrollOffset;
