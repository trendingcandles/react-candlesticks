import { describe, expect, it } from 'vitest';
import { Chart } from '../index';
import ChartDefault from '../Chart';
import ChartCanvasesDefault from '../ChartCanvases';
import InteractiveAreaDefault from '../InteractiveArea';
import StatefulChartDefault from '../StatefulChart';

describe('components exports', () => {
  it('re-exports chart and component defaults', () => {
    expect(Chart).toBe(ChartDefault);
    expect(ChartCanvasesDefault).toBeTruthy();
    expect(InteractiveAreaDefault).toBeTruthy();
    expect(StatefulChartDefault).toBeTruthy();
  });
});
