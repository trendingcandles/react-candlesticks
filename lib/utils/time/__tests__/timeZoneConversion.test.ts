import { describe, expect, it } from 'vitest';
import localToUtc from '../localToUtc';
import utcToLocal from '../utcToLocal';

describe('time zone conversions', () => {
  it('converts local UTC components to epoch milliseconds', () => {
    const utcMs = localToUtc(
      { year: 2026, month: 0, day: 15, hour: 12, minute: 30 },
      'UTC',
    );

    expect(utcMs).toBe(Date.UTC(2026, 0, 15, 12, 30, 0));
  });

  it('converts epoch milliseconds to local UTC components', () => {
    const utcMs = Date.UTC(2026, 6, 4, 8, 45, 0);
    const local = utcToLocal(utcMs, 'UTC');

    expect(local.year).toBe(2026);
    expect(local.month).toBe(6);
    expect(local.day).toBe(4);
    expect(local.hour).toBe(8);
    expect(local.minute).toBe(45);
    expect(local.offset).toBe(0);
  });

  it('round-trips stable non-UTC local times', () => {
    const input = { year: 2026, month: 0, day: 15, hour: 12, minute: 30 };
    const tz = 'America/New_York';

    const utcMs = localToUtc(input, tz);
    const roundTrip = utcToLocal(utcMs, tz);

    expect(roundTrip.year).toBe(input.year);
    expect(roundTrip.month).toBe(input.month);
    expect(roundTrip.day).toBe(input.day);
    expect(roundTrip.hour).toBe(input.hour);
    expect(roundTrip.minute).toBe(input.minute);
  });
});
