import { describe, expect, it, vi } from 'vitest';
import hitTestLayers from '../../drawing/layer/hitTestLayers';
import layers from '../layers';
import sma from '../sma';

describe('layer interactions', () => {
  it('wires hover and click interaction hooks for every built-in layer', () => {
    for (const [layerType, layer] of Object.entries(layers)) {
      expect(layer.hitTest, layerType).toBeTypeOf('function');
      expect(layer.onHover, layerType).toBeTypeOf('function');
      expect(layer.onClick, layerType).toBeTypeOf('function');
    }
  });

  it('hit tests an SMA line and fills layer identity', () => {
    const values = new Float64Array([10, 20, 30]);
    const onElementClick = vi.fn();
    const onLineClick = vi.fn();
    const result = hitTestLayers(
      10,
      80,
      10,
      80,
      {} as never,
      [{
        id: 'panel_0',
        layers: [{
          id: 'sma_0',
          type: 'sma',
          series: {
            value: {
              color: 'orange',
              style: 'solid',
              width: 2,
            },
          },
          offset: 0,
          onElementClick,
          onLineClick,
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
          startBarIndex: 0,
          endBarIndex: 2,
          xToBarIndex: (x: number) => Math.round(x / 10),
        },
        layersData: {
          layerDataInstances: {
            sma_0: {
              outputValues: {
                value: values,
              },
            },
          },
          layersTopology: {
            deducedLayerScales: {
              sma_0: {
                key: 'price_auto',
              },
            },
          },
        },
      } as never,
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
      {
        sma,
      },
    );

    expect(result?.hit).toMatchObject({
      layerId: 'sma_0',
      layerType: 'sma',
      panelId: 'panel_0',
      target: 'line',
      cursor: 'pointer',
    });
    expect(result?.hit.data).toMatchObject({
      output: 'value',
      barIndex: 1,
      value: 20,
    });

    sma.onClick?.(result!.hit, result!.context as never);
    expect(onElementClick).toHaveBeenCalledWith(result?.hit);
    expect(onLineClick).toHaveBeenCalledWith(result?.hit);
  });
});
