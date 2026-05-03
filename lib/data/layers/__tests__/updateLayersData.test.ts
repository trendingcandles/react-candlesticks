import { describe, expect, it } from 'vitest';
import { updateLayersData } from '../updateLayersData';
import { DataMap } from '../../../domain/types/DataMap';
import { LayersData } from '../../../domain/types/LayersData';
import parseLayerConfig from '../../../config/layer/parseLayerConfig';
import defaultLightTheme from '../../../themes/defaultLightTheme';
import { createLayersData } from '../createLayersData';

const dataMap: DataMap = {
  granularity: 'm1',
  rawData: [],
  dataIndexByBar: new Int32Array([0, 1, 2]),
  ohlcvs: {
    timestamp: new Float64Array([1, 2, 3]),
    timeLabel: new Float64Array([1, 2, 3]),
    open: new Float64Array([10, 11, 12]),
    high: new Float64Array([12, 13, 14]),
    low: new Float64Array([9, 10, 11]),
    close: new Float64Array([11, 12, 13]),
    volume: new Float64Array([100, 120, 130]),
  },
};

describe('updateLayersData', () => {
  it('calculates outputs and updates computed range', () => {
    const layer = parseLayerConfig({ type: 'price:line' } as never, defaultLightTheme.layers, 'p0');
    const layersData = createLayersData([layer], { layersInDependencyOrder: [layer], deducedLayerScales: {} }, 3);

    updateLayersData(layersData, dataMap, 0, 2);

    const instance = layersData.layerDataInstances[layer.id];
    expect(instance.outputValues.price).toBe(dataMap.ohlcvs.close);
    expect(instance.computedStartIndex).toBe(0);
    expect(instance.computedEndIndex).toBe(2);
  });

  it('skips recalculation when requested range is already covered', () => {
    const layer = parseLayerConfig({ type: 'price:line' } as never, defaultLightTheme.layers, 'p1');
    const layersData = createLayersData([layer], { layersInDependencyOrder: [layer], deducedLayerScales: {} }, 3);
    const instance = layersData.layerDataInstances[layer.id];

    const sentinel = new Float64Array([7, 7, 7]);
    instance.outputValues.price = sentinel;
    instance.computedStartIndex = 0;
    instance.computedEndIndex = 10;

    updateLayersData(layersData, dataMap, 2, 8);
    expect(instance.outputValues.price).toBe(sentinel);
  });

  it('throws when an unsupported input source is used', () => {
    const badLayer = parseLayerConfig(
      { type: 'price:line', inputs: [{ key: 'input', source: { type: 'derived', layerId: 'x', output: 'y' } }] } as never,
      defaultLightTheme.layers,
      'p2',
    );

    const layersData: LayersData = createLayersData(
      [badLayer],
      { layersInDependencyOrder: [badLayer], deducedLayerScales: {} },
      3,
    );

    expect(() => updateLayersData(layersData, dataMap, 0, 2)).toThrow(/values/);
  });
});
