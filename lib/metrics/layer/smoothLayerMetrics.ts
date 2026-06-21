/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { ScaleSmoothingConfigComplete } from '../../config/chart/scaleSmoothing/ScaleSmoothingConfig';
import { ValueToYFunction } from '../../config/layer/BaseLayerConfig';
import { LayerMetrics } from '../../domain/types/metrics/LayerMetrics';

export interface ScaleSmoothingStateEntry {
  currentMin: number;
  currentMax: number;
  startMin: number;
  startMax: number;
  targetMin: number;
  targetMax: number;
  startedAt: number;
}

export type ScaleSmoothingState = Record<string, ScaleSmoothingStateEntry>;

export interface SmoothLayerMetricsOptions {
  state: ScaleSmoothingState;
  stateKey: string;
  targetMetrics: LayerMetrics;
  config: ScaleSmoothingConfigComplete;
  valueToY: ValueToYFunction;
  top: number;
  height: number;
  now: number;
}

const EPSILON = 0.000001;

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

const hasChanged = (a: number, b: number) => Math.abs(a - b) > EPSILON;

const createMetrics = (
  min: number,
  max: number,
  valueToY: ValueToYFunction,
  top: number,
  height: number,
): LayerMetrics => ({
  min,
  max,
  valueToY: valueToY(min, max, top, height),
});

const smoothLayerMetrics = ({
  state,
  stateKey,
  targetMetrics,
  config,
  valueToY,
  top,
  height,
  now,
}: SmoothLayerMetricsOptions): { metrics: LayerMetrics; settled: boolean } => {
  if (!config.enabled) {
    delete state[stateKey];
    return {
      metrics: targetMetrics,
      settled: true,
    };
  }

  let entry = state[stateKey];

  if (!entry) {
    entry = {
      currentMin: targetMetrics.min,
      currentMax: targetMetrics.max,
      startMin: targetMetrics.min,
      startMax: targetMetrics.max,
      targetMin: targetMetrics.min,
      targetMax: targetMetrics.max,
      startedAt: now,
    };
    state[stateKey] = entry;

    return {
      metrics: targetMetrics,
      settled: true,
    };
  }

  const targetChanged = hasChanged(entry.targetMin, targetMetrics.min) ||
    hasChanged(entry.targetMax, targetMetrics.max);

  if (targetChanged) {
    let currentMin = entry.currentMin;
    let currentMax = entry.currentMax;
    let startMin = entry.currentMin;
    let startMax = entry.currentMax;

    if (config.expandImmediate && targetMetrics.min < currentMin) {
      currentMin = targetMetrics.min;
      startMin = targetMetrics.min;
    }

    if (config.expandImmediate && targetMetrics.max > currentMax) {
      currentMax = targetMetrics.max;
      startMax = targetMetrics.max;
    }

    entry = {
      currentMin,
      currentMax,
      startMin,
      startMax,
      targetMin: targetMetrics.min,
      targetMax: targetMetrics.max,
      startedAt: now,
    };
    state[stateKey] = entry;
  }

  const elapsed = now - entry.startedAt;
  const progress = Math.min(1, Math.max(0, elapsed / config.durationMs));
  const easedProgress = easeOutCubic(progress);

  entry.currentMin = entry.startMin + ((entry.targetMin - entry.startMin) * easedProgress);
  entry.currentMax = entry.startMax + ((entry.targetMax - entry.startMax) * easedProgress);

  const settled = progress >= 1 ||
    (!hasChanged(entry.currentMin, entry.targetMin) && !hasChanged(entry.currentMax, entry.targetMax));

  if (settled) {
    entry.currentMin = entry.targetMin;
    entry.currentMax = entry.targetMax;
  }

  return {
    metrics: createMetrics(entry.currentMin, entry.currentMax, valueToY, top, height),
    settled,
  };
};

export default smoothLayerMetrics;
