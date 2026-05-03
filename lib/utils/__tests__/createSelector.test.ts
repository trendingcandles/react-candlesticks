import { describe, expect, it } from 'vitest';
import createSelector from '../createSelector';

describe('createSelector', () => {
  const source = {
    a: 1,
    b: { c: 2, d: { e: 3, f: { g: 4, h: { i: 5, j: { k: 6 } } } } },
  };

  it('supports optimized paths of depth 1-5', () => {
    expect(createSelector<number>('a')(source)).toBe(1);
    expect(createSelector<number>('b.c')(source)).toBe(2);
    expect(createSelector<number>('b.d.e')(source)).toBe(3);
    expect(createSelector<number>('b.d.f.g')(source)).toBe(4);
    expect(createSelector<number>('b.d.f.h.i')(source)).toBe(5);
  });

  it('supports fallback path for depth > 5 and null-safe traversal', () => {
    expect(createSelector<number>('b.d.f.h.j.k')(source)).toBe(6);
    expect(createSelector<number>('b.missing.path')(source)).toBeUndefined();
    expect(createSelector<number>('a.b.c')(null as unknown as Record<string, unknown>)).toBeUndefined();
  });
});
