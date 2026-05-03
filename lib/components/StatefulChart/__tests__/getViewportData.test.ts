import { describe, expect, it } from 'vitest';
import getViewportData from '../getViewportData';

describe('getViewportData', () => {
  it('computes visible range and xToDataPoint mapping', () => {
    const indexProvider = {
      dataMap: {
        rawData: [{ t: 1 }, { t: 2 }],
        ohlcvs: { close: new Float64Array([1, 2]) },
      },
    } as never;

    const timeScale = {
      xToBarIndex: (x: number) => Math.floor(x / 10),
    } as never;

    const layersData = {
      layerDataInstances: { l1: { outputValues: { value: new Float64Array([3, 4]) } } },
    } as never;

    const viewport = getViewportData(indexProvider, timeScale, layersData, 15, 100, 10);

    expect(viewport.startBarIndex).toBe(1);
    expect(viewport.endBarIndex).toBe(12);

    const dp = viewport.xToDataPoint(35);
    expect(dp.barIndex).toBe(3);
    expect(dp.ohlcvs.close[1]).toBe(2);
    expect(dp.layerDataInstances.l1.outputValues.value[0]).toBe(3);
  });
});
