import { describe, expect, it, vi } from 'vitest';

const {
  drawLayersForScaleMock,
  drawPanelBorderMock,
  mapLayerByScaleMock,
} = vi.hoisted(() => ({
  drawLayersForScaleMock: vi.fn(),
  drawPanelBorderMock: vi.fn(),
  mapLayerByScaleMock: vi.fn(),
}));
vi.mock('../drawLayersForScale', () => ({ default: drawLayersForScaleMock }));
vi.mock('../drawPanelBorder', () => ({ default: drawPanelBorderMock }));
vi.mock('../mapLayersByScale', () => ({ default: mapLayerByScaleMock }));
import drawPanel from '../drawPanel';

describe('drawPanel orchestration', () => {
  it('throws when chart/panel metrics are missing', () => {
    expect(() =>
      drawPanel({} as never, {} as never, {} as never, { id: 'p1', layers: [] } as never, {} as never, {} as never, {} as never, null, 0),
    ).toThrow('No chart metrics found for panel: p1');

    expect(() =>
      drawPanel(
        {} as never,
        {} as never,
        {} as never,
        { id: 'p1', layers: [{ id: 'l1' }] } as never,
        {} as never,
        {} as never,
        { layersData: { layersTopology: { deducedLayerScales: { l1: { key: 's1' } } } } } as never,
        { getPanelMetrics: () => null } as never,
        0,
      ),
    ).toThrow('No panel metrics found for panel: p1');
  });

  it('maps scales and draws border on non-first panels', () => {
    mapLayerByScaleMock.mockReturnValue({ s1: [{ id: 'l1' }] });
    drawLayersForScaleMock.mockReturnValue({ min: 1 });

    const result = drawPanel(
      {} as never,
      {} as never,
      {} as never,
      { id: 'p1', layers: [{ id: 'l1' }] } as never,
      {} as never,
      {} as never,
      { layersData: { layersTopology: { deducedLayerScales: { l1: { key: 's1' } } } } } as never,
      { getPanelMetrics: () => ({ topPx: 0, heightPx: 100 }) } as never,
      1,
    );

    expect(drawLayersForScaleMock).toHaveBeenCalled();
    expect(drawPanelBorderMock).toHaveBeenCalled();
    expect(result?.layerMetricsByScale.s1).toEqual({ min: 1 });
  });
});
