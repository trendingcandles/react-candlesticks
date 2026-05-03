import { describe, expect, it } from 'vitest';
import drawValueMarkerLine from '../drawValueMarkerLine';
import drawValueMarkerLabel from '../drawValueMarkerLabel';
import { createMockContext } from '../../__tests__/testContext';

describe('value marker drawing', () => {
  it('draws marker line and clamps y in last-data mode', () => {
    const ctx = createMockContext();
    drawValueMarkerLine(
      ctx,
      { drawingAreaX: 10, drawingAreaX1: 30 } as never,
      { color: '#f00', width: 2, style: 'dashed', dashes: [1, 1] } as never,
      'last-data',
      {} as never,
      { paddedTopPx: 5, paddedBottomPx: 15 } as never,
      { valueToY: () => 100 } as never,
      {} as never,
      1,
    );

    expect(ctx.moveTo).toHaveBeenCalledWith(10, 15.5);
    expect(ctx.lineTo).toHaveBeenCalledWith(30, 15.5);
    expect(ctx.setLineDash).toHaveBeenCalledWith([]);
  });

  it('skips marker line when value is undefined', () => {
    const ctx = createMockContext();
    drawValueMarkerLine(
      ctx,
      { drawingAreaX: 10, drawingAreaX1: 30 } as never,
      { color: '#f00', width: 2, style: 'solid' } as never,
      'last-visible',
      {} as never,
      { paddedTopPx: 5, paddedBottomPx: 15 } as never,
      { valueToY: () => 10 } as never,
      {} as never,
      undefined,
    );

    expect(ctx.beginPath).not.toHaveBeenCalled();
  });

  it('draws marker label at axis side and renders text', () => {
    const ctx = createMockContext();
    drawValueMarkerLabel(
      ctx,
      { drawingAreaX: 100, drawingAreaX1: 300 } as never,
      {} as never,
      { yAxes: { axesByScale: { price: { offsetPx: 5 } } } } as never,
      { id: 'l1' } as never,
      { side: 'right', width: 50 } as never,
      (v) => `P:${v}`,
      {
        backgroundColor: '#000',
        borderColor: '#fff',
        color: '#fff',
        borderWidth: 1,
        fontFamily: 'sans',
        fontSize: 10,
        fontWeight: '400',
        fontVariant: 'normal',
        fontStyle: 'normal',
        hPadding: 4,
        vPadding: 2,
      } as never,
      'last-visible',
      {} as never,
      { paddedTopPx: 10, paddedBottomPx: 60 } as never,
      { valueToY: () => 20 } as never,
      { layersData: { layersTopology: { deducedLayerScales: { l1: { key: 'price' } } } } } as never,
      42,
    );

    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalledWith('P:42', 309, 20);
  });
});
