import { describe, expect, it, vi } from 'vitest';
import defineDrawing from '../defineDrawing';
import createDrawingRegistry from '../createDrawingRegistry';
import parseDrawingConfigs from '../../config/drawing/parseDrawingConfigs';
import drawDrawings from '../../drawing/drawing/drawDrawings';
import hitTestDrawings from '../../drawing/drawing/hitTestDrawings';
import { createMockContext } from '../../drawing/__tests__/testContext';

describe('custom drawings', () => {
  it('creates a JSX component with stable drawing metadata and parses defaults', () => {
    const customDrawing = defineDrawing({
      type: 'custom:test-drawing',
      draw: () => {},
    });
    const registry = createDrawingRegistry([customDrawing]);

    const parsed = parseDrawingConfigs(
      [{ type: 'custom:test-drawing' }],
      'panel_0',
      registry,
    );

    expect(parsed).toEqual([{
      id: 'custom:test-drawing_panel_0_0',
      type: 'custom:test-drawing',
      visible: true,
    }]);
    expect(customDrawing.Component.displayName).toBe('custom:test-drawingDrawing');
  });

  it('rejects duplicate drawing types', () => {
    const customDrawing = defineDrawing({
      type: 'custom:test-drawing',
      draw: () => {},
    });

    expect(() => createDrawingRegistry([customDrawing, customDrawing]))
      .toThrow('Duplicate drawing type: custom:test-drawing');
  });

  it('draws panel drawings with coordinate helpers', () => {
    const draw = vi.fn();
    const customDrawing = defineDrawing({
      type: 'custom:test-drawing',
      draw,
    });
    const registry = createDrawingRegistry([customDrawing]);

    drawDrawings(
      createMockContext(),
      createMockContext(),
      {} as never,
      {
        id: 'panel_0',
        drawings: [{
          id: 'drawing_0',
          type: 'custom:test-drawing',
          visible: true,
        }],
      } as never,
      { drawingAreaWidth: 500 } as never,
      {
        timeScale: {
          metadata: {
            intervalSize: 10,
            scrollOffset: 5,
          },
          timestampToIndex: () => 3,
        },
      } as never,
      {} as never,
      {
        topPx: 0,
        heightPx: 100,
      } as never,
      {
        price_auto: {
          min: 0,
          max: 100,
          valueToY: (value: number) => 100 - value,
        },
      },
      registry,
    );

    expect(draw).toHaveBeenCalledOnce();
    const renderContext = draw.mock.calls[0][0];
    expect(renderContext.scaleKey).toBe('price_auto');
    expect(renderContext.xForTimestamp(123)).toBe(25);
    expect(renderContext.valueToY(40)).toBe(60);
  });

  it('hit tests panel drawings and fills hit identity', () => {
    const hitTest = vi.fn(({ pointer }) => ({
      target: 'segment',
      cursor: 'pointer',
      data: {
        panelX: pointer.panelX,
        value: pointer.value,
      },
    }));
    const customDrawing = defineDrawing({
      type: 'custom:test-drawing',
      draw: () => {},
      hitTest,
    });
    const registry = createDrawingRegistry([customDrawing]);

    const result = hitTestDrawings(
      20,
      50,
      20,
      50,
      {} as never,
      [{
        id: 'panel_0',
        drawings: [{
          id: 'drawing_0',
          type: 'custom:test-drawing',
          visible: true,
        }],
      }] as never,
      {
        drawingAreaX: 0,
        drawingAreaX1: 500,
        drawingAreaY: 0,
        drawingAreaY1: 100,
      } as never,
      {
        indexProvider: {
          indexToTimestamp: (index: number) => index * 1000,
        },
        timeScale: {
          metadata: {
            intervalSize: 10,
            scrollOffset: 0,
          },
          xToBarIndex: (x: number) => Math.floor(x / 10),
          timestampToIndex: () => 2,
        },
      } as never,
      null,
      {
        panel_0: {
          panelMetrics: {
            topPx: 0,
            bottomPx: 100,
            paddedTopPx: 0,
            paddedHeightPx: 100,
          },
          layerMetricsByScale: {
            price_auto: {
              min: 0,
              max: 100,
              valueToY: (value: number) => 100 - value,
            },
          },
        },
      } as never,
      registry,
      createMockContext(),
      createMockContext(),
    );

    expect(hitTest).toHaveBeenCalledOnce();
    expect(result?.hit).toEqual({
      drawingId: 'drawing_0',
      drawingType: 'custom:test-drawing',
      panelId: 'panel_0',
      target: 'segment',
      cursor: 'pointer',
      data: {
        panelX: 20,
        value: 50,
      },
    });
  });
});
