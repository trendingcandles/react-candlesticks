import { describe, expect, it } from 'vitest';
import createPriceVolumeCalculationContext from '../createPriceVolumeCalculationContext';
import createPriceVolumeDerivedLayerCalculationContext from '../createPriceVolumeDerivedLayerCalculationContext';
import { createLayersData } from '../createLayersData';
import { DataMap } from '../../../domain/types/DataMap';
import { LayerConfigComplete } from '../../../config/layer/LayerConfig';

const dataMap: DataMap = {
  granularity: 'm1',
  rawData: [],
  dataIndexByBar: new Int32Array([0, 1]),
  ohlcvs: {
    timestamp: new Float64Array([1, 2]),
    timeLabel: new Float64Array([1, 2]),
    open: new Float64Array([10, 11]),
    high: new Float64Array([12, 13]),
    low: new Float64Array([9, 10]),
    close: new Float64Array([11, 12]),
    volume: new Float64Array([100, 120]),
  },
};

describe('layer data setup contexts', () => {
  it('resolves price and volume series in contexts', () => {
    const base = createPriceVolumeCalculationContext(dataMap);
    expect(base.resolve({ key: 'in', source: { type: 'price', field: 'close' } })).toEqual({ id: 'close', values: dataMap.ohlcvs.close });
    expect(base.resolve({ key: 'in', source: { type: 'volume', field: 'volume' } })).toEqual({ id: 'volume', values: dataMap.ohlcvs.volume });
    expect(base.resolve({ key: 'x', source: { type: 'other' } } as never)).toBeNull();

    const derived = createPriceVolumeDerivedLayerCalculationContext(dataMap, { layerDataInstances: {}, layersTopology: { layersInDependencyOrder: [], deducedLayerScales: {} } });
    expect(derived.resolve({ key: 'in', source: { type: 'price', field: 'open' } })).toEqual({ id: 'open', values: dataMap.ohlcvs.open });
    expect(derived.resolve({ key: 'x', source: { type: 'unknown' } } as never)).toBeUndefined();
  });

  it('creates layer data instances with NaN-filled outputs', () => {
    const layers = [
      { id: 'a', type: 'price:line', outputs: ['price'] },
      { id: 'b', type: 'sma', outputs: ['value', 'extra'] },
    ] as unknown as LayerConfigComplete[];

    const layersData = createLayersData(layers, { layersInDependencyOrder: [], deducedLayerScales: {} }, 3);
    expect(Object.keys(layersData.layerDataInstances)).toEqual(['a', 'b']);

    const a = layersData.layerDataInstances.a;
    expect(Number.isNaN(a.outputValues.price[0])).toBe(true);
    expect(a.computedStartIndex).toBe(Infinity);
    expect(a.computedEndIndex).toBe(-Infinity);

    const b = layersData.layerDataInstances.b;
    expect(Number.isNaN(b.outputValues.value[1])).toBe(true);
    expect(Number.isNaN(b.outputValues.extra[2])).toBe(true);
  });
});
