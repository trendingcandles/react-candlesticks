import { describe, expect, it } from 'vitest';
import parseScaleSmoothingConfig from '../parseScaleSmoothingConfig';

describe('parseScaleSmoothingConfig', () => {
  it('defaults to disabled', () => {
    expect(parseScaleSmoothingConfig(undefined)).toEqual({
      enabled: false,
      durationMs: 160,
      expandImmediate: true,
    });
  });

  it('enables smoothing from a boolean', () => {
    expect(parseScaleSmoothingConfig(true)).toEqual({
      enabled: true,
      durationMs: 160,
      expandImmediate: true,
    });
  });

  it('parses custom smoothing options', () => {
    expect(parseScaleSmoothingConfig({ durationMs: 240, expandImmediate: false })).toEqual({
      enabled: true,
      durationMs: 240,
      expandImmediate: false,
    });
  });
});
