import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockContext } from '../../__tests__/testContext';

const lineMock = vi.hoisted(() => vi.fn());
const labelMock = vi.hoisted(() => vi.fn());
vi.mock('../drawValueMarkerLine', () => ({ default: lineMock }));
vi.mock('../drawValueMarkerLabel', () => ({ default: labelMock }));
import drawValueMarker from '../drawValueMarker';

describe('drawValueMarker', () => {
  beforeEach(() => {
    lineMock.mockReset();
    labelMock.mockReset();
  });

  it('delegates to line and label renderers when enabled', () => {
    drawValueMarker(
      createMockContext(),
      createMockContext(),
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      (v) => `${v}`,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { mode: 'last-visible', line: { width: 1 }, label: { fontSize: 10 } } as never,
      1,
    );

    expect(lineMock).toHaveBeenCalled();
    expect(labelMock).toHaveBeenCalled();
  });

  it('does not draw label when yAxis is missing', () => {
    drawValueMarker(
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
      { mode: 'last-visible', line: null, label: { fontSize: 10 } } as never,
      1,
    );

    expect(labelMock).not.toHaveBeenCalled();
  });
});
