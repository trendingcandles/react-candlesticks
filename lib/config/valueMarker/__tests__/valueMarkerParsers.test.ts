import { describe, expect, it } from 'vitest';
import parseValueMarkerConfig from '../parseValueMarkerConfig';
import parseDirectionalValueMarkerConfig from '../parseDirectionalValueMarkerConfig';
import { themeDefaultValueMarker } from '../ValueMarkerConfig';

describe('value marker parsers', () => {
  it('parses value marker and handles false', () => {
    expect(parseValueMarkerConfig(false, themeDefaultValueMarker)).toBeNull();

    const parsed = parseValueMarkerConfig({ line: {}, label: { borderRadius: 5 }, mode: 'last-data' }, themeDefaultValueMarker, 'cyan');
    expect(parsed?.mode).toBe('last-data');
    expect(parsed?.line?.color).toBe('cyan');
    expect(parsed?.label?.backgroundColor).toBe('cyan');
    expect(parsed?.label?.borderRadius).toBe(5);
  });

  it('parses directional value marker and handles false', () => {
    expect(parseDirectionalValueMarkerConfig(false)).toBeNull();

    const parsed = parseDirectionalValueMarkerConfig({ showLine: false, up: { line: {} } });
    expect(parsed?.showLine).toBe(false);
    expect(parsed?.up.line).toBeTruthy();
    expect(parsed?.down.label).toBeTruthy();
  });
});
