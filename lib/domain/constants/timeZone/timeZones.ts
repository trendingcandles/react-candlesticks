/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export const allTimeZones = () => {
  if (typeof Intl.supportedValuesOf === 'function') {
    const timeZones = Intl.supportedValuesOf('timeZone');
    return timeZones;
  } else {
    // Fallback for very old browsers (pre-2022)
    console.warn("Intl.supportedValuesOf is not supported in this browser.");
    return [];
  }
};

export const timeZones = () => {
  return [
    "America/Los_Angeles",   // UTC-7/UTC-8 (Cboe Options)
    "America/Mexico_City",   // UTC-5/UTC-6 (BMV)
    "America/Chicago",       // UTC-5/UTC-6 (CME Data Center)
    "America/New_York",      // UTC-4/UTC-5 (NYSE, NASDAQ, CME/NYMEX)
    "Europe/London",         // UTC+0/UTC+1 (LSE, ICE Futures Europe)
    "Europe/Oslo",           // UTC+1/UTC+2 (Oslo Stock Exchange)
    "Europe/Madrid",         // UTC+1/UTC+2 (BME)
    "Europe/Zurich",         // UTC+1/UTC+2 (SIX Swiss Exchange)
    "Europe/Frankfurt",      // UTC+1/UTC+2 (FSX, Eurex)
    "Europe/Paris",          // UTC+1/UTC+2 (Euronext Paris, Amsterdam, Brussels, Lisbon)
    "Europe/Istanbul",       // UTC+3 (Borsa Istanbul)
    "Europe/Athens",         // UTC+2/UTC+3 (Athens Exchange)
    "Europe/Helsinki",       // UTC+2/UTC+3 (Nasdaq Nordic Helsinki)
    "Africa/Johannesburg",   // UTC+2 (JSE)
    "Asia/Riyadh",           // UTC+3 (Tadawul)
    "Asia/Dubai",            // UTC+4 (DFM, DGCX)
    "Asia/Bangkok",          // UTC+7 (SET)
    "Asia/Jakarta",          // UTC+7 (IDX)
    "Asia/Manila",           // UTC+8 (PSE)
    "Asia/Kuala_Lumpur",     // UTC+8 (Bursa Malaysia)
    "Asia/Singapore",        // UTC+8 (SGX)
    "Asia/Shanghai",         // UTC+8 (SSE, DCE)
    "Asia/Hong_Kong",        // UTC+8 (HKEX)
    "Asia/Taipei",           // UTC+8 (TWSE)
    "Asia/Seoul",            // UTC+9 (KRX)
    "Asia/Tokyo",            // UTC+9 (JPX)
    "Australia/Sydney",      // UTC+10/UTC+11 (ASX)
    "Pacific/Auckland",      // UTC+12/UTC+13 (NZX)
  ];
};
