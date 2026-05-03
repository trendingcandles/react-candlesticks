/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

/* eslint-disable @typescript-eslint/no-explicit-any, no-case-declarations */

const createSelector = <T = any>(propDescriptor: string): ((obj: any) => T | undefined) => {
  const keys = propDescriptor.split('.');
  
  // Generate optimized code based on depth
  switch (keys.length) {
    case 1:
      return (obj) => obj?.[keys[0]];
    case 2:
      return (obj) => obj?.[keys[0]]?.[keys[1]];
    case 3:
      return (obj) => obj?.[keys[0]]?.[keys[1]]?.[keys[2]];
    case 4:
      return (obj) => obj?.[keys[0]]?.[keys[1]]?.[keys[2]]?.[keys[3]];
    case 5:
      return (obj) => obj?.[keys[0]]?.[keys[1]]?.[keys[2]]?.[keys[3]]?.[keys[4]];
    default:
      // Fallback to loop for deeper paths
      const len = keys.length;
      return (obj: any): T | undefined => {
        let current = obj;
        for (let i = 0; i < len; i++) {
          if (current == null) return undefined;
          current = current[keys[i]];
        }
        return current;
      };
  }
};

export default createSelector;
