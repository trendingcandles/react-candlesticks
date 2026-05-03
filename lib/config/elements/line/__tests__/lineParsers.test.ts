import { describe, expect, it } from 'vitest';
import parseLineConfig from '../parseLineConfig';
import parseDirectionalLineConfig from '../parseDirectionalLineConfig';

describe('line parsers', () => {
  it('parses line config and handles false', () => {
    expect(parseLineConfig(false)).toBeNull();
    expect(parseLineConfig({ color: 'red', width: 2 })?.color).toBe('red');
  });

  it('validates numeric line inputs', () => {
    expect(() => parseLineConfig({ width: -1 })).toThrow('line.width must be >= 0');
    expect(() => parseLineConfig({ dashes: [2, -1] })).toThrow('line.dashes[1] must be >= 0');
  });

  it('parses directional line variants', () => {
    expect(parseDirectionalLineConfig(false)).toBeNull();
    const parsed = parseDirectionalLineConfig({ up: { color: 'lime' }, down: {}, flat: {} });
    expect(parsed?.up.color).toBe('lime');
    expect(parsed?.down).toBeTruthy();
    expect(parsed?.flat).toBeTruthy();
  });
});
