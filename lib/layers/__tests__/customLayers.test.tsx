import { describe, expect, it, vi } from 'vitest';
import defineLayer from '../defineLayer';
import createLayerRegistry from '../createLayerRegistry';
import { CustomLayerConfig, CustomLayerConfigComplete } from '../../config/layer/LayerConfig';
import parseLayerConfig from '../../config/layer/parseLayerConfig';
import defaultLightTheme from '../../themes/defaultLightTheme';
import { createLayersData } from '../../data/layers/createLayersData';
import { updateLayersData } from '../../data/layers/updateLayersData';
import { DataMap } from '../../domain/types/DataMap';
import { mapLayerElementToConfig } from '../../components/Chart/parseConfigComponents';
import drawLayer from '../../drawing/layer/drawLayer';

interface DoubleLayerConfig extends CustomLayerConfig {
  type: 'custom:double';
  multiplier?: number;
}

interface DoubleLayerConfigComplete extends CustomLayerConfigComplete {
  type: 'custom:double';
  multiplier: number;
}

const valueToY = (min: number, max: number, top: number, height: number) => {
  const range = max - min;
  return (value: number) => top + ((max - value) / range) * height;
};

const draw = vi.fn();

const doubleLayer = defineLayer<DoubleLayerConfig, DoubleLayerConfigComplete>({
  type: 'custom:double',
  displayName: 'Double',
  parseConfig: (config, _theme, panelId) => ({
    id: config.id ?? `double_${panelId}`,
    type: 'custom:double',
    indicator: true,
    defaultScale: { key: 'value', domain: 'value', range: { type: 'auto' } },
    scale: config.scale ?? null,
    scalePolicy: 'derived',
    valueToY,
    legend: null,
    yAxis: null,
    valueLabelFormatter: String,
    requiredInputKeys: ['input'],
    inputs: config.inputs ?? [{ key: 'input', source: { type: 'price', field: 'close' } }],
    outputs: ['value'],
    period: config.period ?? 1,
    offset: 0,
    lookback: config.lookback ?? 0,
    calculate: config.calculate ?? true,
    includeInAutoScale: config.includeInAutoScale ?? true,
    multiplier: config.multiplier ?? 2,
  }),
  calculate: (config, inputs, outputs, startBarIndex, endBarIndex) => {
    for (let index = startBarIndex; index < endBarIndex; index++) {
      outputs.value[index] = inputs.input.values[index] * config.multiplier;
    }
  },
  draw,
});

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

describe('custom layers', () => {
  it('creates a JSX component with stable layer metadata', () => {
    const CustomDouble = doubleLayer.Component;
    const config = mapLayerElementToConfig(<CustomDouble multiplier={3} />);

    expect(config).toMatchObject({
      type: 'custom:double',
      multiplier: 3,
    });
  });

  it('uses the chart-scoped registry for parsing, calculation, and drawing', () => {
    const registry = createLayerRegistry([doubleLayer]);
    const config = parseLayerConfig(
      { type: 'custom:double', multiplier: 3 },
      defaultLightTheme.layers,
      'panel_0',
      registry,
    ) as DoubleLayerConfigComplete;
    const topology = {
      layersInDependencyOrder: [config],
      deducedLayerScales: { [config.id]: config.defaultScale },
    };
    const layersData = createLayersData([config], topology, 3, registry);

    updateLayersData(layersData, dataMap, 0, 3);

    expect(Array.from(layersData.layerDataInstances[config.id].outputValues.value))
      .toEqual([33, 36, 39]);

    drawLayer(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      config,
      {} as never,
      { layersData } as never,
      {} as never,
      {} as never,
      {} as never,
    );
    expect(draw).toHaveBeenCalledOnce();
  });

  it('rejects built-in and custom type collisions', () => {
    expect(() => createLayerRegistry([{
      ...doubleLayer,
      type: 'sma',
    }])).toThrow('Duplicate layer type: sma');

    expect(() => createLayerRegistry([doubleLayer, doubleLayer]))
      .toThrow('Duplicate layer type: custom:double');
  });
});
