/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

// Example: "2024-03-15T14:30:45.123Z"

const isoTimestampToMs = (isoTimestampString: string) => {

  return new Date(isoTimestampString).getTime();

};

export default isoTimestampToMs;
