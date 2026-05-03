import { describe, expect, it } from 'vitest';
import parseBarConfig from '../parseBarConfig';
import parseDirectionalBarConfig from '../parseDirectionalBarConfig';

describe('bar parsers', () => {
  it('parses bar config and handles false', () => {
    expect(parseBarConfig(false)).toBeNull();
    expect(parseBarConfig({ width: 0.7, backgroundColor: 'black' })?.width).toBe(0.7);
  });

  it('parses directional bar config', () => {
    expect(parseDirectionalBarConfig(false)).toBeNull();
    const parsed = parseDirectionalBarConfig({ up: { backgroundColor: 'green' } });
    expect(parsed?.up.backgroundColor).toBe('green');
    expect(parsed?.down).toBeTruthy();
    expect(parsed?.flat).toBeTruthy();
  });
});
