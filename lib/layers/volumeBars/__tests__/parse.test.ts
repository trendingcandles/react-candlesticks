import { describe, expect, it } from 'vitest';
import parse from '../parse';
import defaultLightTheme from '../../../themes/defaultLightTheme';

describe('volumeBars parse', () => {
  it('uses defaults with generated id', () => {
    const cfg = parse({ type: 'volume:bars' }, defaultLightTheme.layers as never, 'panel-a');

    expect(cfg.id).toBe('volume-bars-layer_panel-a');
    expect(cfg.legend?.label).toBe('Volume');
    expect(cfg.requiredInputKeys).toEqual(['volume']);
  });

  it('applies explicit id and formatter overrides', () => {
    const formatter = (v: number) => `${v} units`;
    const cfg = parse(
      {
        type: 'volume:bars',
        id: 'vol-custom',
        series: {
          bars: {
            up: { backgroundColor: '#00aa00' },
            down: { backgroundColor: '#aa0000' },
            flat: { backgroundColor: '#999999' },
          },
        },
        markers: { value: false },
        valueLabelFormatter: formatter,
      },
      defaultLightTheme.layers as never,
      'panel-b',
    );

    expect(cfg.id).toBe('vol-custom');
    expect(cfg.series.bars?.up.backgroundColor).toBe('#00aa00');
    expect(cfg.markers.value).toBeNull();
    expect(cfg.valueLabelFormatter).toBe(formatter);
    expect(cfg.scalePolicy).toBe('fixed');
  });
});
