import { describe, expect, it, vi } from 'vitest';

const drawPanelMock = vi.hoisted(() => vi.fn());
vi.mock('../drawPanel', () => ({ default: drawPanelMock }));
import drawPanels from '../drawPanels';

describe('drawPanels', () => {
  it('collects metrics by panel id when available', () => {
    drawPanelMock
      .mockReturnValueOnce({ panelMetrics: { topPx: 0 }, layerMetricsByScale: {} })
      .mockReturnValueOnce(undefined);

    const out = drawPanels(
      {} as never,
      {} as never,
      {} as never,
      [{ id: 'p1' }, { id: 'p2' }] as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    expect(Object.keys(out)).toEqual(['p1']);
  });
});
