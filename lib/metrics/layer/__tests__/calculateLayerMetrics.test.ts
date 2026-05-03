import { describe, expect, it } from 'vitest';
import calculateLayerMetrics from '../calculateLayerMetrics';
import { DataMap } from '../../../domain/types/DataMap';
import { LayersData } from '../../../domain/types/LayersData';
import { LayerConfigComplete } from '../../../config/layer/LayerConfig';
import { PanelMetrics } from '../../../domain/types/metrics/PanelMetrics';
import { LayerScale } from '../../../config/layer/BaseLayerConfig';

const dataMap: DataMap = {
  granularity: 'm1',
  rawData: [],
  dataIndexByBar: new Int32Array([0, 1, 2]),
  ohlcvs: {
    timestamp: new Float64Array([1, 2, 3]),
    timeLabel: new Float64Array([1, 2, 3]),
    open: new Float64Array([10, 11, 12]),
    high: new Float64Array([15, 16, 17]),
    low: new Float64Array([7, 8, 9]),
    close: new Float64Array([11, 12, 13]),
    volume: new Float64Array([100, 150, 120]),
  },
};

const panelMetrics: PanelMetrics = {
  position: 0,
  topPx: 0,
  heightPx: 200,
  bottomPx: 200,
  paddedTopPx: 10,
  paddedHeightPx: 180,
  paddedBottomPx: 190,
};

const baseLayerConfig = {
  id: 'l1',
  type: 'price:line',
  indicator: false,
  valueToY: (min: number, max: number, top: number, height: number) => (v: number) => top + ((max - v) / (max - min)) * height,
} as unknown as LayerConfigComplete;

const scale: LayerScale = { key: 'price', domain: 'price', range: { type: 'auto' } };

describe('calculateLayerMetrics', () => {
  it('returns null when value range is zero', () => {
    const layersData: LayersData = {
      layerDataInstances: {
        l1: {
          id: 'l1',
          layerType: 'price:line',
          layerConfig: { indicator: true, includeInAutoScale: true } as never,
          inputs: {},
          outputValues: { x: new Float64Array([0, 0, 0]) },
          computedStartIndex: 0,
          computedEndIndex: 2,
        },
      },
      layersTopology: { layersInDependencyOrder: [], deducedLayerScales: {} },
    };

    const result = calculateLayerMetrics(dataMap, layersData, 0, 2, [baseLayerConfig], baseLayerConfig, panelMetrics, { key: 'value', domain: 'value', range: { type: 'positive' } });
    expect(result).toBeNull();
  });

  it('returns min/max and a valueToY mapper', () => {
    const layersData: LayersData = {
      layerDataInstances: {
        l1: {
          id: 'l1',
          layerType: 'price:line',
          layerConfig: { indicator: true, includeInAutoScale: true } as never,
          inputs: {},
          outputValues: { x: new Float64Array([3, 4, 6]) },
          computedStartIndex: 0,
          computedEndIndex: 2,
        },
      },
      layersTopology: { layersInDependencyOrder: [], deducedLayerScales: {} },
    };

    const result = calculateLayerMetrics(dataMap, layersData, 0, 2, [baseLayerConfig], baseLayerConfig, panelMetrics, scale);
    expect(result?.min).toBe(3);
    expect(result?.max).toBe(17);
    expect(result?.valueToY(17)).toBeCloseTo(10);
    expect(result?.valueToY(3)).toBeCloseTo(190);
  });
});
