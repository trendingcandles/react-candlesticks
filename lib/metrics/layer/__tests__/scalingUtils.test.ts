import { describe, expect, it } from 'vitest';
import getIndicatorScalingValues from '../getIndicatorScalingValues';
import getMinAndMaxValues from '../getMinAndMaxValues';
import { LayerDataInstance } from '../../../domain/types/LayersData';
import { OHLCVData } from '../../../domain/types/DataMap';

const ohlcvs: OHLCVData = {
  timestamp: new Float64Array([1, 2, 3]),
  timeLabel: new Float64Array([1, 2, 3]),
  open: new Float64Array([10, 11, 12]),
  high: new Float64Array([15, 18, 21]),
  low: new Float64Array([7, 8, 9]),
  close: new Float64Array([12, 13, 14]),
  volume: new Float64Array([100, 200, 300]),
};

const mkLayer = (
  indicator: boolean,
  includeInAutoScale: boolean,
  outputValues: Record<string, Float64Array>,
): LayerDataInstance => ({
  id: 'l',
  layerType: 'sma',
  layerConfig: { indicator, includeInAutoScale } as never,
  inputs: {},
  outputValues,
  computedStartIndex: 0,
  computedEndIndex: 2,
});

describe('layer scaling utilities', () => {
  it('collects indicator arrays only when enabled for autoscale', () => {
    const values = getIndicatorScalingValues([
      mkLayer(false, true, { a: new Float64Array([1, 2, 3]) }),
      mkLayer(true, false, { b: new Float64Array([4, 5, 6]) }),
      mkLayer(true, true, { c: new Float64Array([7, 8, 9]), d: new Float64Array([0, 1, 2]) }),
    ]);

    expect(values).toHaveLength(2);
    expect(Array.from(values[0])).toEqual([7, 8, 9]);
    expect(Array.from(values[1])).toEqual([0, 1, 2]);
  });

  it('computes min/max for supported scale combinations', () => {
    const layers = [mkLayer(true, true, { ind: new Float64Array([5, 25, 2]) })];

    const priceAuto = getMinAndMaxValues(ohlcvs, layers, { key: 'p', domain: 'price', range: { type: 'auto' } }, 0, 2);
    expect(priceAuto).toEqual({ min: 2, max: 25 });

    const volumePositive = getMinAndMaxValues(ohlcvs, layers, { key: 'v', domain: 'volume', range: { type: 'positive' } }, 0, 2);
    expect(volumePositive).toEqual({ min: 0, max: 300 });

    const bounded = getMinAndMaxValues(ohlcvs, layers, { key: 'b', domain: 'value', range: { type: 'bounded', min: 1, max: 9 } }, 0, 2);
    expect(bounded).toEqual({ min: 1, max: 9 });

    const valueAuto = getMinAndMaxValues(ohlcvs, layers, { key: 'va', domain: 'value', range: { type: 'auto' } }, 0, 2);
    expect(valueAuto).toEqual({ min: 2, max: 25 });

    const zeroCentered = getMinAndMaxValues(ohlcvs, layers, { key: 'z', domain: 'value', range: { type: 'zero-centered' } }, 0, 2);
    expect(zeroCentered).toEqual({ min: 2, max: 25 });

    const valuePositive = getMinAndMaxValues(ohlcvs, layers, { key: 'vp', domain: 'value', range: { type: 'positive' } }, 0, 2);
    expect(valuePositive).toEqual({ min: 0, max: 25 });
  });

  it('throws for invalid scale combinations', () => {
    expect(() =>
      getMinAndMaxValues(ohlcvs, [], { key: 'x', domain: 'percent', range: { type: 'auto' } }, 0, 1)
    ).toThrow('Invalid layer scale percent - auto');
  });
});
