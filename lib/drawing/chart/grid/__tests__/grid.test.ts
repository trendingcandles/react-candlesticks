import { beforeEach, describe, expect, it, vi } from 'vitest';
import calculateValueGridLines from '../value/calculateValueGridLines';
import getDefaultValueGridLines from '../value/getDefaultValueGridLines';
import drawValueGridLines from '../value/drawValueGridLines';
import isTimeGridLine from '../time/isTimeGridLine';
import drawTimeGridLines from '../time/drawTimeGridLines';
import { createMockContext } from '../../../__tests__/testContext';

const drawTimeGridLabelMock = vi.hoisted(() => vi.fn());
vi.mock('../../../elements/labels/timeLabel/drawTimeGridLabel', () => ({
  default: drawTimeGridLabelMock,
}));
import drawTimeGridLabels from '../time/drawTimeGridLabels';

describe('drawing grid modules', () => {
  beforeEach(() => {
    drawTimeGridLabelMock.mockReset();
  });

  it('calculates value grid lines from explicit and inferred steps', () => {
    const explicit = calculateValueGridLines(0, 100, (v) => v, 4, [1, 5]);
    expect(explicit).toEqual([{ value: 1, y: 1 }, { value: 5, y: 5 }]);

    const inferred = calculateValueGridLines(11, 41, (v) => v, 4);
    expect(inferred.length).toBeGreaterThan(1);
    expect(inferred[0].value).toBeLessThanOrEqual(11);
    expect(inferred.at(-1)!.value).toBeGreaterThanOrEqual(41);
  });

  it('draws value grid lines only inside panel bounds', () => {
    const ctx = createMockContext();
    drawValueGridLines(
      ctx,
      { drawingAreaWidth: 200 } as never,
      { grid: { value: { width: 1, color: '#444' } } } as never,
      {} as never,
      [{ y: 10, value: 1 }, { y: 110, value: 2 }, { y: 210, value: 3 }],
      { topPx: 50, bottomPx: 150 } as never,
    );

    expect(ctx.moveTo).toHaveBeenCalledTimes(1);
    expect(ctx.lineTo).toHaveBeenCalledWith(200, 110.5);
    expect(getDefaultValueGridLines()).toEqual([]);
  });

  it('detects time grid boundaries and sets secondary labels', () => {
    const grid = { unit: 'hour', number: 1, major: false } as never;
    const date = new Date(Date.UTC(2025, 0, 2, 0, 0, 0));
    const prev = new Date(Date.UTC(2025, 0, 1, 23, 0, 0));

    const result = isTimeGridLine(grid, date, prev);
    expect(result).not.toBe(false);
    expect((result as { isSecondaryLabel?: boolean }).isSecondaryLabel).toBe(true);
    expect(isTimeGridLine(grid, date)).toBe(false);
  });

  it('draws time grid lines and labels respecting label filters', () => {
    const ctx = createMockContext();
    const timeScale = {
      metadata: { intervalSize: 10, scrollOffset: 0 },
      gridLines: [
        { barIndex: 1, major: false, timestamp: 10 },
        { barIndex: 20, major: false, timestamp: 20 },
        { barIndex: 25, major: true, timestamp: 25 },
      ],
    } as never;

    drawTimeGridLines(
      ctx,
      { drawingAreaY: 5, drawingAreaY1: 25 } as never,
      { grid: { time: { width: 1, color: '#ccc' } } } as never,
      timeScale,
    );
    expect(ctx.moveTo).toHaveBeenCalledTimes(3);

    drawTimeGridLabels(
      ctx,
      { drawingAreaY1: 30 } as never,
      {
        xAxis: {
          majorLabels: { formatter: () => 'M' },
          minorLabels: { formatter: () => 'm' },
          timeZoneId: 'UTC',
        },
      } as never,
      timeScale,
    );
    expect(drawTimeGridLabelMock).toHaveBeenCalledTimes(3);
  });
});
