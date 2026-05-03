import { describe, expect, it } from 'vitest';
import parse from '../parse';
import defaultLightTheme from '../../../themes/defaultLightTheme';

describe('priceLine parse', () => {
  it('builds default config', () => {
    const cfg = parse({ type: 'price:line' }, defaultLightTheme.layers as never, 'panel-a');

    expect(cfg.id).toBe('price-line_panel-a');
    expect(cfg.legend?.label).toBe('Price');
    expect(cfg.requiredInputKeys).toEqual(['input']);
  });

  it('applies override values', () => {
    const valueLabelFormatter = (v: number) => `P:${v}`;
    const cfg = parse(
      {
        type: 'price:line',
        id: 'price-custom',
        calculate: false,
        includeInAutoScale: false,
        series: { value: { color: '#2244ff' } },
        markers: { value: false },
        valueLabelFormatter,
      },
      defaultLightTheme.layers as never,
      'panel-b',
    );

    expect(cfg.id).toBe('price-custom');
    expect(cfg.calculate).toBe(true);
    expect(cfg.includeInAutoScale).toBe(true);
    expect(cfg.series.value?.color).toBe('#2244ff');
    expect(cfg.markers.value).toBeNull();
    expect(cfg.valueLabelFormatter).toBe(valueLabelFormatter);
  });
});
