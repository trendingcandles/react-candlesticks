import { describe, expect, it } from 'vitest';
import parse from '../parse';
import defaultLightTheme from '../../../themes/defaultLightTheme';

describe('candlesticks parse', () => {
  it('uses defaults when partial config is minimal', () => {
    const cfg = parse({ type: 'price:candlesticks' }, defaultLightTheme.layers as never, 'panel-a');

    expect(cfg.id).toBe('candlestick-layer_panel-a');
    expect(cfg.scale).toBeNull();
    expect(cfg.calculate).toBe(true);
    expect(cfg.includeInAutoScale).toBe(true);
  });

  it('applies explicit overrides', () => {
    const valueToY = () => () => 42;
    const valueLabelFormatter = (v: number) => `C:${v}`;

    const cfg = parse(
      {
        type: 'price:candlesticks',
        id: 'custom-candles',
        scale: { key: 'price_custom', domain: 'price', range: { type: 'auto' } },
        series: {
          body: {
            up: { backgroundColor: '#00aa00' },
            down: { backgroundColor: '#aa0000' },
            flat: { backgroundColor: '#999999' },
          },
        },
        markers: { value: false },
        valueToY,
        valueLabelFormatter,
      },
      defaultLightTheme.layers as never,
      'panel-b',
    );

    expect(cfg.id).toBe('custom-candles');
    expect(cfg.scale?.key).toBe('price_custom');
    expect(cfg.series.body?.up.backgroundColor).toBe('#00aa00');
    expect(cfg.markers.value).toBeNull();
    expect(cfg.valueToY).toBe(valueToY);
    expect(cfg.valueLabelFormatter).toBe(valueLabelFormatter);
  });
});
