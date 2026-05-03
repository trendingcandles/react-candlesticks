import { describe, expect, it } from 'vitest';
import parse from '../parse';
import defaultLightTheme from '../../../themes/defaultLightTheme';

describe('sma parse', () => {
  it('uses defaults for period/id/lookback', () => {
    const cfg = parse({ type: 'sma' }, defaultLightTheme.layers as never, 'panel-a');

    expect(cfg.id).toBe('sma-layer_panel-a_50');
    expect(cfg.period).toBe(50);
    expect(cfg.lookback).toBe(50);
    expect(cfg.scalePolicy).toBe('derived');
  });

  it('applies custom period, lookback and output flags', () => {
    const cfg = parse(
      {
        type: 'sma',
        period: 10,
        lookback: (period) => period + 2,
        calculate: false,
        includeInAutoScale: true,
        outputs: ['value'],
        series: { value: { color: '#123456' } },
      },
      defaultLightTheme.layers as never,
      'panel-b',
    );

    expect(cfg.id).toBe('sma-layer_panel-b_10');
    expect(cfg.lookback).toBe(12);
    expect(cfg.calculate).toBe(false);
    expect(cfg.includeInAutoScale).toBe(true);
    expect(cfg.outputs).toEqual(['value']);
    expect(cfg.series.value?.color).toBe('#123456');
  });
});
