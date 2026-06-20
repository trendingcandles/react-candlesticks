import { describe, expect, it } from 'vitest';
import smoothLayerMetrics, { ScaleSmoothingState } from '../smoothLayerMetrics';

const valueToY = (min: number, max: number, top: number, height: number) => (value: number) =>
  top + ((max - value) / (max - min)) * height;

const config = {
  enabled: true,
  durationMs: 100,
  expandImmediate: true,
};

describe('smoothLayerMetrics', () => {
  it('returns target metrics and clears state when disabled', () => {
    const state: ScaleSmoothingState = {
      s1: {
        currentMin: 1,
        currentMax: 9,
        startMin: 1,
        startMax: 9,
        targetMin: 1,
        targetMax: 9,
        startedAt: 0,
      },
    };

    const result = smoothLayerMetrics({
      state,
      stateKey: 's1',
      targetMetrics: { min: 2, max: 8, valueToY: (value) => value },
      config: { ...config, enabled: false },
      valueToY,
      top: 0,
      height: 100,
      now: 0,
    });

    expect(result.metrics.min).toBe(2);
    expect(result.metrics.max).toBe(8);
    expect(result.settled).toBe(true);
    expect(state.s1).toBeUndefined();
  });

  it('animates contracting domains toward the target', () => {
    const state: ScaleSmoothingState = {};

    smoothLayerMetrics({
      state,
      stateKey: 's1',
      targetMetrics: { min: 0, max: 10, valueToY: (value) => value },
      config,
      valueToY,
      top: 0,
      height: 100,
      now: 0,
    });

    smoothLayerMetrics({
      state,
      stateKey: 's1',
      targetMetrics: { min: 2, max: 8, valueToY: (value) => value },
      config,
      valueToY,
      top: 0,
      height: 100,
      now: 50,
    });

    const halfway = smoothLayerMetrics({
      state,
      stateKey: 's1',
      targetMetrics: { min: 2, max: 8, valueToY: (value) => value },
      config,
      valueToY,
      top: 0,
      height: 100,
      now: 100,
    });

    expect(halfway.settled).toBe(false);
    expect(halfway.metrics.min).toBeGreaterThan(0);
    expect(halfway.metrics.min).toBeLessThan(2);
    expect(halfway.metrics.max).toBeLessThan(10);
    expect(halfway.metrics.max).toBeGreaterThan(8);
  });

  it('expands immediately to avoid clipping new visible values', () => {
    const state: ScaleSmoothingState = {};

    smoothLayerMetrics({
      state,
      stateKey: 's1',
      targetMetrics: { min: 2, max: 8, valueToY: (value) => value },
      config,
      valueToY,
      top: 0,
      height: 100,
      now: 0,
    });

    const expanded = smoothLayerMetrics({
      state,
      stateKey: 's1',
      targetMetrics: { min: 0, max: 10, valueToY: (value) => value },
      config,
      valueToY,
      top: 0,
      height: 100,
      now: 1,
    });

    expect(expanded.metrics.min).toBe(0);
    expect(expanded.metrics.max).toBe(10);
    expect(expanded.settled).toBe(true);
  });
});
