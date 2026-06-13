import { describe, expect, it } from 'vitest';
import parse from '../parse';
import defaultLightTheme from '../../../themes/defaultLightTheme';

describe('stochastic parse', () => {
  it('builds default stochastic config', () => {
    const cfg = parse({ type: 'stochastic' }, defaultLightTheme.layers as never, 'panel-a');

    expect(cfg.id).toBe('stochastic-layer_panel-a_14_3_3');
    expect(cfg.kPeriod).toBe(14);
    expect(cfg.period).toBe(14);
    expect(cfg.kSmoothing).toBe(3);
    expect(cfg.dPeriod).toBe(3);
    expect(cfg.lookback).toBe(17);
    expect(cfg.valueGridLines).toEqual([20, 80]);
  });

  it('applies overrides and custom lookback', () => {
    const cfg = parse(
      {
        type: 'stochastic',
        kPeriod: 7,
        kSmoothing: 2,
        dPeriod: 2,
        lookback: 20,
        calculate: false,
        includeInAutoScale: false,
        series: {
          k: { color: '#00aa00' },
          d: { color: '#aa0000' },
        },
      },
      defaultLightTheme.layers as never,
      'panel-b',
    );

    expect(cfg.id).toBe('stochastic-layer_panel-b_7_2_2');
    expect(cfg.kPeriod).toBe(7);
    expect(cfg.period).toBe(7);
    expect(cfg.lookback).toBe(20);
    expect(cfg.calculate).toBe(false);
    expect(cfg.includeInAutoScale).toBe(false);
    expect(cfg.series.k?.color).toBe('#00aa00');
    expect(cfg.series.d?.color).toBe('#aa0000');
  });

  it('supports legacy period as alias for kPeriod', () => {
    const cfg = parse(
      {
        type: 'stochastic',
        period: 9,
      },
      defaultLightTheme.layers as never,
      'panel-c',
    );

    expect(cfg.kPeriod).toBe(9);
    expect(cfg.period).toBe(9);
    expect(cfg.lookback).toBe(12);
    expect(cfg.id).toBe('stochastic-layer_panel-c_9_3_3');
  });

  it('supports source shorthand for high/low/close inputs', () => {
    const cfg = parse(
      {
        type: 'stochastic',
        source: { high: 'open', low: 'low', close: 'volume' },
      },
      defaultLightTheme.layers as never,
      'panel-d',
    );

    expect(cfg.inputs).toEqual([
      { key: 'high', source: { type: 'price', field: 'open' } },
      { key: 'low', source: { type: 'price', field: 'low' } },
      { key: 'close', source: { type: 'volume', field: 'volume' } },
    ]);
  });

  it('prefers explicit input fields over source object shorthand', () => {
    const cfg = parse(
      {
        type: 'stochastic',
        source: { high: 'open', low: 'open', close: 'open' },
        inputs: [
          { key: 'high', source: { type: 'price', field: 'high' } },
          { key: 'low', source: { type: 'price', field: 'low' } },
          { key: 'close', source: { type: 'price', field: 'close' } },
        ],
      },
      defaultLightTheme.layers as never,
      'panel-e',
    );

    expect(cfg.inputs).toEqual([
      { key: 'high', source: { type: 'price', field: 'high' } },
      { key: 'low', source: { type: 'price', field: 'low' } },
      { key: 'close', source: { type: 'price', field: 'close' } },
    ]);
  });
});
