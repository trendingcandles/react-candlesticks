import { describe, expect, it, vi } from 'vitest';
import { createMockContext } from '../../__tests__/testContext';

const markerMock = vi.hoisted(() => vi.fn());
vi.mock('../drawValueMarker', () => ({ default: markerMock }));
import drawDirectionalValueMarker from '../drawDirectionalValueMarker';

describe('drawDirectionalValueMarker', () => {
  it('skips when both showLine and showLabel are false', () => {
    drawDirectionalValueMarker(
      createMockContext(),
      createMockContext(),
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      null,
      (v) => `${v}`,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { mode: 'static', showLine: false, showLabel: false, up: {}, down: {}, flat: {} } as never,
      1,
      0,
    );

    expect(markerMock).not.toHaveBeenCalled();
  });

  it('uses up/down/flat configs by direction', () => {
    markerMock.mockReset();

    drawDirectionalValueMarker(
      createMockContext(),
      createMockContext(),
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      null,
      (v) => `${v}`,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {
        mode: 'last-data',
        showLine: true,
        showLabel: false,
        up: { line: { color: 'green' } },
        down: { line: { color: 'red' } },
        flat: { line: { color: 'gray' } },
      } as never,
      1,
      -1,
    );

    const configArg = markerMock.mock.calls[0][12];
    expect(configArg.mode).toBe('last-data');
    expect(configArg.line.color).toBe('red');
  });
});
