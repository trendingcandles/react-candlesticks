import { describe, expect, it } from 'vitest';
import mapLayerByScale from '../mapLayersByScale';
import getPanelYAxes from '../getPanelYAxes';
import drawPanelBorder from '../drawPanelBorder';
import { createMockContext } from '../../__tests__/testContext';

describe('panel core utilities', () => {
  it('groups layers by scale key', () => {
    const grouped = mapLayerByScale(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as never,
      { a: { key: 'left' }, b: { key: 'left' }, c: { key: 'right' } } as never,
    );

    expect(Object.keys(grouped)).toEqual(['left', 'right']);
    expect(grouped.left).toHaveLength(2);
  });

  it('builds panel y-axes widths and mapping', () => {
    const panelYAxes = getPanelYAxes(
      {
        id: 'p1',
        layers: [
          { id: 'a', yAxis: { side: 'left', width: 40 }, valueLabelFormatter: (v: number) => `${v}` },
          { id: 'b', yAxis: { side: 'right', width: 50 }, valueLabelFormatter: (v: number) => `${v}` },
        ],
      } as never,
      { deducedLayerScales: { a: { key: 's1' }, b: { key: 's2' } } } as never,
    );

    expect(panelYAxes.leftTotalWidth).toBe(40);
    expect(panelYAxes.rightTotalWidth).toBe(50);
    expect(panelYAxes.axesByScale.s1?.side).toBe('left');
  });

  it('draws top panel border and resets dash state', () => {
    const ctx = createMockContext();
    drawPanelBorder(
      ctx,
      {} as never,
      {} as never,
      { borderTop: { color: '#333', width: 1, style: 'dashed', dashes: [2, 2] } } as never,
      [] as never,
      { drawingAreaX: 10, drawingAreaX1: 100 } as never,
      {} as never,
      {} as never,
      { topPx: 20 } as never,
    );

    expect(ctx.moveTo).toHaveBeenCalledWith(10, 19);
    expect(ctx.lineTo).toHaveBeenCalledWith(100, 19);
    expect(ctx.setLineDash).toHaveBeenCalledWith([]);
  });
});
