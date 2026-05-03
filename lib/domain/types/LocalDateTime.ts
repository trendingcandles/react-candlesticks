/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

export interface LocalDateTimeWithDow {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  dow: number; // 0-based
  offset: number;
}

export type LocalDate = {
  year: number;   // 2024
  month: number;  // 0–11
  day: number;    // 1–31
};

export type LocalTime = {
  hour: number;   // 0–23
  minute: number; // 0–59
};

export type LocalDateTime = LocalDate & LocalTime;
