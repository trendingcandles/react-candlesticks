import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockContext } from '../../__tests__/testContext';

const {
  calculateLayerMetricsMock,
  calculateValueGridLinesMock,
  drawValueGridLinesMock,
  drawValueGridLabelsMock,
  drawLayersMock,
} = vi.hoisted(() => ({
  calculateLayerMetricsMock: vi.fn(),
  calculateValueGridLinesMock: vi.fn(),
  drawValueGridLinesMock: vi.fn(),
  drawValueGridLabelsMock: vi.fn(),
  drawLayersMock: vi.fn(),
}));

vi.mock('../../../metrics/layer/calculateLayerMetrics', () => ({ default: calculateLayerMetricsMock }));
vi.mock('../../chart/grid/value/calculateValueGridLines', () => ({ default: calculateValueGridLinesMock }));
vi.mock('../../chart/grid/value/drawValueGridLines', () => ({ default: drawValueGridLinesMock }));
vi.mock('../../elements/labels/valueLabel/drawValueGridLabels', () => ({ default: drawValueGridLabelsMock }));
vi.mock('../../layer/drawLayers', () => ({ default: drawLayersMock }));

import drawLayersForScale from '../drawLayersForScale';

describe('drawLayersForScale', () => {
  beforeEach(() => {
    calculateLayerMetricsMock.mockReset();
    calculateValueGridLinesMock.mockReset();
    drawValueGridLinesMock.mockReset();
    drawValueGridLabelsMock.mockReset();
    drawLayersMock.mockReset();
  });

  it('returns undefined when layer metrics missing', () => {
    calculateLayerMetricsMock.mockReturnValue(undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = drawLayersForScale(
      createMockContext(),
      createMockContext(),
      {} as never,
      { id: 'p1', yAxes: { axesByScale: { s1: { offsetPx: 0 } } }, heightRatio: 1 } as never,
      {} as never,
      {} as never,
      { dataMap: {}, layersData: {}, timeScale: { startBarIndex: 0, endBarIndex: 1 } } as never,
      { totalPanelsHeightUnits: 1 } as never,
      { topPx: 0, heightPx: 100 } as never,
      0,
      { key: 's1' } as never,
      [{ id: 'l1' }] as never,
    );

    expect(result).toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('draws grid lines, labels and layers when metrics exist', () => {
    const ctx = createMockContext();
    calculateLayerMetricsMock.mockReturnValue({ min: 1, max: 9, valueToY: (v: number) => v });
    calculateValueGridLinesMock.mockReturnValue([{ value: 1, y: 1 }]);

    const result = drawLayersForScale(
      ctx,
      createMockContext(),
      {} as never,
      { yAxes: { axesByScale: { s1: { offsetPx: 0 } } }, heightRatio: 1 } as never,
      {} as never,
      {} as never,
      { dataMap: {}, layersData: {}, timeScale: { startBarIndex: 0, endBarIndex: 1 } } as never,
      { totalPanelsHeightUnits: 1 } as never,
      { topPx: 0, heightPx: 100 } as never,
      0,
      { key: 's1' } as never,
      [{ id: 'l1' }] as never,
    );

    expect(result).toEqual({ min: 1, max: 9, valueToY: expect.any(Function) });
    expect(ctx.save).toHaveBeenCalled();
    expect(drawValueGridLinesMock).toHaveBeenCalled();
    expect(drawValueGridLabelsMock).toHaveBeenCalled();
    expect(drawLayersMock).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
  });
});
