import { afterEach, describe, expect, it, vi } from 'vitest';
import { allTimeZones, timeZones } from '../timeZones';

describe('domain timezone constants', () => {
  const originalSupportedValuesOf = Intl.supportedValuesOf;

  afterEach(() => {
    Intl.supportedValuesOf = originalSupportedValuesOf;
    vi.restoreAllMocks();
  });

  it('returns supported values when Intl.supportedValuesOf exists', () => {
    Intl.supportedValuesOf = vi.fn(() => ['UTC', 'Europe/London']) as typeof Intl.supportedValuesOf;
    expect(allTimeZones()).toEqual(['UTC', 'Europe/London']);
    expect(Intl.supportedValuesOf).toHaveBeenCalledWith('timeZone');
  });

  it('warns and returns empty list when Intl.supportedValuesOf is unavailable', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    Intl.supportedValuesOf = undefined as unknown as typeof Intl.supportedValuesOf;

    expect(allTimeZones()).toEqual([]);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('returns curated timezone list with key market zones', () => {
    const zones = timeZones();
    expect(zones).toContain('America/New_York');
    expect(zones).toContain('Europe/London');
    expect(zones).toContain('Asia/Tokyo');
    expect(zones).toContain('Australia/Sydney');
    expect(new Set(zones).size).toBe(zones.length);
    expect(zones.length).toBeGreaterThan(20);
  });
});
