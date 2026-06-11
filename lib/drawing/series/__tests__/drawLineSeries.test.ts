import { describe, expect, it } from 'vitest';
import { LineConfigComplete } from '../../../config/elements/line/LineConfig';
import { createMockContext } from '../../__tests__/testContext';

import drawLineSeries from '../drawLineSeries';

describe('drawLineSeries', () => {
  it('draws finite visible values and returns the last drawn bar', () => {
    const context = createMockContext();
    const values = new Float64Array([10, Number.NaN, 20, Number.POSITIVE_INFINITY, 30]);
    const lineConfig: LineConfigComplete = {
      color: '#fff',
      width: 2,
      style: 'dashed',
      dashes: [3, 2],
    };
    const valueToY = (value: number) => value + 1;

    const result = drawLineSeries({
      context,
      values,
      lineConfig,
      valueToY,
      startBarIndex: 0,
      endBarIndex: 4,
      intervalSize: 10,
      scrollOffset: 0,
    });

    expect(context.save).toHaveBeenCalledOnce();
    expect(context.strokeStyle).toBe('#fff');
    expect(context.lineWidth).toBe(2);
    expect(context.setLineDash).toHaveBeenCalledWith([3, 2]);
    expect(context.beginPath).toHaveBeenCalledOnce();
    expect(context.moveTo).toHaveBeenCalledWith(0, 11);
    expect(context.lineTo).toHaveBeenNthCalledWith(1, 20, 21);
    expect(context.lineTo).toHaveBeenNthCalledWith(2, 40, 31);
    expect(context.stroke).toHaveBeenCalledOnce();
    expect(context.ellipse).not.toHaveBeenCalled();
    expect(context.fill).not.toHaveBeenCalled();
    expect(context.restore).toHaveBeenCalledOnce();
    expect(result).toEqual({ lastBarIndex: 4 });
  });

  it('draws an end dot when the last available data point is drawn', () => {
    const context = createMockContext();

    drawLineSeries({
      context,
      values: new Float64Array([5, Number.NaN, 7]),
      lineConfig: {
        color: '#123',
        width: 1,
        style: 'solid',
        endDotSize: 4,
      },
      valueToY: (value) => value + 10,
      startBarIndex: 0,
      endBarIndex: 2,
      intervalSize: 10,
      scrollOffset: 5,
    });

    expect(context.fillStyle).toBe('#123');
    expect(context.ellipse).toHaveBeenCalledWith(
      15,
      17,
      4,
      4,
      Math.PI / 4,
      0,
      2 * Math.PI,
    );
    expect(context.fill).toHaveBeenCalledOnce();
  });

  it('does not draw an end dot when the last available data point is outside the viewport', () => {
    const context = createMockContext();

    drawLineSeries({
      context,
      values: new Float64Array([5, 6, 7]),
      lineConfig: {
        color: '#123',
        width: 1,
        style: 'solid',
        endDotSize: 4,
      },
      valueToY: (value) => value,
      startBarIndex: 0,
      endBarIndex: 1,
      intervalSize: 10,
      scrollOffset: 0,
    });

    expect(context.ellipse).not.toHaveBeenCalled();
    expect(context.fill).not.toHaveBeenCalled();
  });

  it('does not draw an end dot when the last available data point has no value', () => {
    const context = createMockContext();

    drawLineSeries({
      context,
      values: new Float64Array([5, 6, Number.NaN]),
      lineConfig: {
        color: '#123',
        width: 1,
        style: 'solid',
        endDotSize: 4,
      },
      valueToY: (value) => value,
      startBarIndex: 0,
      endBarIndex: 2,
      intervalSize: 10,
      scrollOffset: 0,
    });

    expect(context.ellipse).not.toHaveBeenCalled();
    expect(context.fill).not.toHaveBeenCalled();
  });

  it('applies bar and scroll offsets to x coordinates', () => {
    const context = createMockContext();

    drawLineSeries({
      context,
      values: new Float64Array([5, 6]),
      lineConfig: {
        color: '#fff',
        width: 1,
        style: 'solid',
      },
      valueToY: (value) => value,
      startBarIndex: 0,
      endBarIndex: 1,
      intervalSize: 10,
      scrollOffset: 5,
      barOffset: 2,
    });

    expect(context.setLineDash).toHaveBeenCalledWith([]);
    expect(context.moveTo).toHaveBeenCalledWith(15, 5);
    expect(context.lineTo).toHaveBeenCalledWith(25, 6);
  });

  it('does not start or end a path when no finite values are visible', () => {
    const context = createMockContext();

    const result = drawLineSeries({
      context,
      values: new Float64Array([Number.NaN, Number.POSITIVE_INFINITY]),
      lineConfig: {
        color: '#fff',
        width: 1,
        style: 'solid',
      },
      valueToY: (value) => value,
      startBarIndex: 0,
      endBarIndex: 1,
      intervalSize: 10,
      scrollOffset: 0,
    });

    expect(context.save).not.toHaveBeenCalled();
    expect(context.beginPath).not.toHaveBeenCalled();
    expect(context.stroke).not.toHaveBeenCalled();
    expect(context.restore).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
