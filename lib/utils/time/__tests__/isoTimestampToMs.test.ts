/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { describe, it, expect } from 'vitest';
import isoTimestampToMs from '../isoTimestampToMs';

describe('isoTimestampToMs', () => {
  it('should convert ISO timestamp string to milliseconds', () => {
    const isoString = '2024-03-15T14:30:45.123Z';
    const result = isoTimestampToMs(isoString);
    
    expect(result).toBe(1710513045123);
  });

  it('should handle ISO timestamp without milliseconds', () => {
    const isoString = '2024-03-15T14:30:45Z';
    const result = isoTimestampToMs(isoString);
    
    expect(result).toBe(1710513045000);
  });

  it('should handle different dates correctly', () => {
    const isoString = '2023-01-01T00:00:00.000Z';
    const result = isoTimestampToMs(isoString);
    
    expect(result).toBe(1672531200000);
  });

  it('should handle ISO timestamp with timezone offset', () => {
    const isoString = '2024-03-15T14:30:45.123+00:00';
    const result = isoTimestampToMs(isoString);
    
    expect(result).toBe(1710513045123);
  });

  it('should return the same timestamp regardless of local timezone', () => {
    const isoString = '2024-03-15T14:30:45.123Z';
    const expected = 1710513045123;
    
    const result = isoTimestampToMs(isoString);
    
    expect(result).toBe(expected);
  });

  it('should handle Unix epoch', () => {
    const isoString = '1970-01-01T00:00:00.000Z';
    const result = isoTimestampToMs(isoString);
    
    expect(result).toBe(0);
  });

  it('should return NaN for invalid ISO string', () => {
    const invalidString = 'invalid-date';
    const result = isoTimestampToMs(invalidString);
    
    expect(result).toBeNaN();
  });
});
