import { describe, expect, it } from 'vitest';
import DAYS from '../days';
import MONTHS from '../months';
import { DAY_MS, HOUR_MS, MINUTE_MS, WEEK_MS } from '../timeDurationsAsMs';

describe('domain time constants', () => {
  it('exports canonical short day and month labels', () => {
    expect(DAYS).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(MONTHS).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  });

  it('exports consistent time durations in milliseconds', () => {
    expect(MINUTE_MS).toBe(60_000);
    expect(HOUR_MS).toBe(60 * MINUTE_MS);
    expect(DAY_MS).toBe(24 * HOUR_MS);
    expect(WEEK_MS).toBe(7 * DAY_MS);
  });
});
