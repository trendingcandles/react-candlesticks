import { describe, expect, it } from 'vitest';
import parseLegendFieldConfig from '../parseLegendFieldConfig';
import parseLegendFieldConfigs from '../parseLegendFieldsConfig';
import parseLegendConfig from '../parseLegendConfig';
import { legendFieldDefaults } from '../LegendFieldConfig';
import { themeDefaultLegend } from '../LegendConfig';
import { themeDefaultLabel } from '../../elements/label/LabelConfig';

describe('legend parsers', () => {
  const defaultsForLayer = {
    close: { output: 'close', label: 'C', color: 'blue', valueSelector: () => 1 },
    open: { output: 'open', label: 'O', valueSelector: () => 2 },
  };
  const legendTheme = {
    ...themeDefaultLegend,
    ...themeDefaultLabel,
    fields: [
      { output: 'close', color: 'green', label: 'Close' },
      { output: 'open', color: 'orange', label: 'Open' },
    ],
  };

  it('parses legend field config', () => {
    const parsed = parseLegendFieldConfig({ output: 'close' }, { output: 'close', color: 'red' }, defaultsForLayer.close);
    expect(parsed.output).toBe('close');
    expect(parsed.color).toBe('blue');
    expect(parsed.valueSelector({})).toBe(1);
    expect(legendFieldDefaults.color).toBeTruthy();
  });

  it('parses legend fields and rejects unknown outputs', () => {
    const fields = parseLegendFieldConfigs([{ output: 'close' }], legendTheme.fields, defaultsForLayer);
    expect(fields).toHaveLength(2);
    expect(() => parseLegendFieldConfigs([{ output: 'bad' }], [], defaultsForLayer)).toThrow('Invalid legend field output');
  });

  it('parses legend config with false/object toggles', () => {
    expect(parseLegendConfig(false, legendTheme, defaultsForLayer)).toBeNull();
    const parsed = parseLegendConfig({}, legendTheme, defaultsForLayer);
    expect(parsed?.fields).toHaveLength(2);
  });
});
