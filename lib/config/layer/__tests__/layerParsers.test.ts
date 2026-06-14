import { describe, expect, it } from 'vitest';
import parseLookback from '../parseLookback';
import validateLayerInputs from '../validateLayerInputs';
import createLayerTopology from '../createLayerTopology';
import parseLayerConfig from '../parseLayerConfig';
import parseLayerConfigs from '../parseLayerConfigs';
import defaultLightTheme from '../../../themes/defaultLightTheme';
import type { LayerConfigComplete } from '../LayerConfig';

describe('layer parsers and utils', () => {
  it('parses lookback and validates layer inputs', () => {
    expect(parseLookback(10)).toBe(10);
    expect(parseLookback(10, 4)).toBe(4);
    expect(parseLookback(10, (p) => p + 2)).toBe(12);

    expect(() => validateLayerInputs([{ key: 'a', source: { type: 'price', field: 'close' } }], ['a', 'b'])).toThrow('Missing required input keys');
    expect(() => validateLayerInputs([
      { key: 'a', source: { type: 'price', field: 'close' } },
      { key: 'a', source: { type: 'volume', field: 'volume' } },
    ], ['a'])).toThrow('Duplicate input keys found');
  });

  it('creates topology and rejects duplicate ids', () => {
    const sharedScale = { key: 'x', domain: 'price', range: { type: 'auto' as const } };
    const layerA = { id: 'a', defaultScale: sharedScale, scale: null } as LayerConfigComplete;
    const layerB = { id: 'b', defaultScale: sharedScale, scale: sharedScale } as LayerConfigComplete;

    const topology = createLayerTopology([{ id: 'p', layers: [layerA, layerB] } as never]);
    expect(topology.layersInDependencyOrder).toHaveLength(2);
    expect(topology.deducedLayerScales.b.key).toBe('x');

    expect(() => createLayerTopology([{ id: 'p', layers: [layerA, layerA] } as never])).toThrow('Duplicate layer ids found');
  });

  it('parses layer configs and validates numeric fields', () => {
    expect(() => parseLayerConfig({ type: 'sma', period: 0 } as never, defaultLightTheme.layers, 'panel_0')).toThrow('sma.period must be > 0');
    expect(() => parseLayerConfig({ type: 'sma', lookback: -1 } as never, defaultLightTheme.layers, 'panel_0')).toThrow('sma.lookback must be >= 0');
    expect(() => parseLayerConfig({ type: 'sma', valueGridLines: [1, Number.NaN] } as never, defaultLightTheme.layers, 'panel_0')).toThrow('sma.valueGridLines[1] must be a finite number');
    expect(() => parseLayerConfig({ type: 'bad:type' } as never, defaultLightTheme.layers, 'panel_0')).toThrow('Invalid layer type');

    const parsed = parseLayerConfigs([{ type: 'price:line' } as never], defaultLightTheme.layers, 'panel_0');
    expect(parsed[0].type).toBe('price:line');

    expect(() => parseLayerConfigs([
      { type: 'sma', period: 20 },
      { type: 'sma', period: 20 },
    ] as never, defaultLightTheme.layers, 'panel_1')).toThrow('Duplicate layer ids found in panel "panel_1"');
  });
});
