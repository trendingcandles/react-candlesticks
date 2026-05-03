import { describe, expect, it } from 'vitest';
import generateTimeGridLines from '../generateTimeGridLines';
import getTimeGridStep from '../getTimeGridStep';
import isTimeGridLine, { UNIT_FN } from '../isTimeGridLine';
import { DataMap } from '../../../domain/types/DataMap';

describe('time grid line helpers', () => {
  it('picks grid steps including parity and fallback', () => {
    const parityStep = getTimeGridStep(80, 'm1');
    expect(parityStep.number).toBe(5);
    expect(parityStep.parityGridLine?.number).toBe(1);

    const standardStep = getTimeGridStep(20, 'm1');
    expect(standardStep.number).toBe(5);
    expect(standardStep.parityGridLine).toBeUndefined();

    const fallbackStep = getTimeGridStep(0.1, 'm1');
    expect(fallbackStep.number).toBe(30);

    expect(() => getTimeGridStep(10, 'bad' as never)).toThrow('Invalid interval key');
  });

  it('computes line boundaries and major transitions', () => {
    const step = { granularity: 'm1', unit: 'minute', number: 1, multiple: 1 } as const;
    expect(isTimeGridLine(step, { year: 2026, month: 0, day: 1, hour: 10, minute: 1 })).toBe(false);

    const prev = { year: 2026, month: 0, day: 1, hour: 23, minute: 59 };
    const next = { year: 2026, month: 0, day: 2, hour: 0, minute: 0 };
    expect(isTimeGridLine(step, next, prev, 1_000)).toEqual({ major: true });

    const same = { year: 2026, month: 0, day: 2, hour: 0, minute: 0 };
    const sameBucket = isTimeGridLine(step, same, same, UNIT_FN.minute(same));
    expect(sameBucket).toBe(false);
  });

  it('generates grid lines and skips NaN timestamps', () => {
    const t1 = Date.UTC(2026, 0, 1, 23, 59);
    const t2 = Date.UTC(2026, 0, 2, 0, 0);
    const t3 = Date.UTC(2026, 0, 2, 0, 1);
    const dataMap = {
      ohlcvs: {
        timestamp: [Number.NaN, t1, t2, t3],
        timeLabel: [t1, t1, t2, t3],
      },
    } as unknown as DataMap;

    const lines = generateTimeGridLines(
      dataMap,
      0,
      3,
      { granularity: 'm1', unit: 'minute', number: 1, multiple: 1 },
      10,
      0,
      100,
      'UTC',
    );

    expect(lines.map(l => l.barIndex)).toEqual([2, 3]);
    expect(lines[0].major).toBe(true);
    expect(lines[1].major).toBe(false);
  });
});
