/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { LayerConfigComplete } from '../../config/layer/LayerConfig';
import { LayerInputSeries } from '../../domain/types/LayersData';
import { AdxLayerConfigComplete } from './AdxLayerConfig';

const calc = (
  layerConfig: LayerConfigComplete,
  inputs: Record<string, LayerInputSeries>,
  outputValues: Record<string, Float64Array>,
  startBarIndex: number,
  endBarIndex: number,
) => {
  const { diLength, smoothing } = layerConfig as AdxLayerConfigComplete;
  const highs = inputs.high.values;
  const lows = inputs.low.values;
  const closes = inputs.close.values;
  const adxValues = outputValues.value;

  const trueRanges = new Map<number, number>();
  const plusDmValues = new Map<number, number>();
  const minusDmValues = new Map<number, number>();
  const smoothedTrueRanges = new Map<number, number>();
  const smoothedPlusDmValues = new Map<number, number>();
  const smoothedMinusDmValues = new Map<number, number>();
  const dxValues = new Map<number, number>();

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const previousBarIndex = barIndex - 1;
    const high = highs[barIndex];
    const low = lows[barIndex];
    const previousHigh = highs[previousBarIndex];
    const previousLow = lows[previousBarIndex];
    const previousClose = closes[previousBarIndex];

    if (![high, low, previousHigh, previousLow, previousClose].every(Number.isFinite)) continue;

    const upMove = high - previousHigh;
    const downMove = previousLow - low;
    trueRanges.set(barIndex, Math.max(high - low, Math.abs(high - previousClose), Math.abs(low - previousClose)));
    plusDmValues.set(barIndex, upMove > downMove && upMove > 0 ? upMove : 0);
    minusDmValues.set(barIndex, downMove > upMove && downMove > 0 ? downMove : 0);
  }

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const previousBarIndex = barIndex - 1;
    const trueRange = trueRanges.get(barIndex);
    const plusDm = plusDmValues.get(barIndex);
    const minusDm = minusDmValues.get(barIndex);

    if (trueRange === undefined || plusDm === undefined || minusDm === undefined) continue;

    const previousSmoothedTrueRange = smoothedTrueRanges.get(previousBarIndex);
    const previousSmoothedPlusDm = smoothedPlusDmValues.get(previousBarIndex);
    const previousSmoothedMinusDm = smoothedMinusDmValues.get(previousBarIndex);

    if (
      previousSmoothedTrueRange !== undefined
      && previousSmoothedPlusDm !== undefined
      && previousSmoothedMinusDm !== undefined
    ) {
      smoothedTrueRanges.set(barIndex, previousSmoothedTrueRange - (previousSmoothedTrueRange / diLength) + trueRange);
      smoothedPlusDmValues.set(barIndex, previousSmoothedPlusDm - (previousSmoothedPlusDm / diLength) + plusDm);
      smoothedMinusDmValues.set(barIndex, previousSmoothedMinusDm - (previousSmoothedMinusDm / diLength) + minusDm);
    } else {
      let trueRangeSum = 0;
      let plusDmSum = 0;
      let minusDmSum = 0;
      let count = 0;

      for (let offset = 0; offset < diLength; offset++) {
        const lookbackBarIndex = barIndex - offset;
        const lookbackTrueRange = trueRanges.get(lookbackBarIndex);
        const lookbackPlusDm = plusDmValues.get(lookbackBarIndex);
        const lookbackMinusDm = minusDmValues.get(lookbackBarIndex);

        if (lookbackTrueRange !== undefined && lookbackPlusDm !== undefined && lookbackMinusDm !== undefined) {
          trueRangeSum += lookbackTrueRange;
          plusDmSum += lookbackPlusDm;
          minusDmSum += lookbackMinusDm;
          count++;
        }
      }

      if (count === diLength) {
        smoothedTrueRanges.set(barIndex, trueRangeSum);
        smoothedPlusDmValues.set(barIndex, plusDmSum);
        smoothedMinusDmValues.set(barIndex, minusDmSum);
      }
    }

    const smoothedTrueRange = smoothedTrueRanges.get(barIndex);
    const smoothedPlusDm = smoothedPlusDmValues.get(barIndex);
    const smoothedMinusDm = smoothedMinusDmValues.get(barIndex);

    if (
      smoothedTrueRange === undefined
      || smoothedPlusDm === undefined
      || smoothedMinusDm === undefined
      || smoothedTrueRange === 0
    ) continue;

    const plusDi = (smoothedPlusDm / smoothedTrueRange) * 100;
    const minusDi = (smoothedMinusDm / smoothedTrueRange) * 100;

    const directionalIndexDenominator = plusDi + minusDi;
    dxValues.set(
      barIndex,
      directionalIndexDenominator === 0
        ? 0
        : (Math.abs(plusDi - minusDi) / directionalIndexDenominator) * 100,
    );
  }

  for (let barIndex = startBarIndex; barIndex < endBarIndex; barIndex++) {
    const dx = dxValues.get(barIndex);
    if (dx === undefined) continue;

    const previousAdx = adxValues[barIndex - 1];
    if (Number.isFinite(previousAdx)) {
      adxValues[barIndex] = ((previousAdx * (smoothing - 1)) + dx) / smoothing;
      continue;
    }

    let dxSum = 0;
    let count = 0;
    for (let offset = 0; offset < smoothing; offset++) {
      const lookbackDx = dxValues.get(barIndex - offset);
      if (lookbackDx !== undefined) {
        dxSum += lookbackDx;
        count++;
      }
    }

    if (count === smoothing) {
      adxValues[barIndex] = dxSum / smoothing;
    }
  }
};

export default calc;
