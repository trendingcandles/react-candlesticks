import { describe, expect, expectTypeOf, it } from 'vitest';
import type {
  BordersConfig,
  BordersConfigComplete,
  BordersTheme,
  ChartConfig,
  ChartConfigComplete,
  CrosshairsConfig,
  CrosshairsConfigComplete,
  CrosshairsTheme,
  GridConfig,
  GridConfigComplete,
  GridTheme,
  WatermarkConfig,
  WatermarkConfigComplete,
  WatermarkTheme,
  XAxisConfig,
  XAxisConfigComplete,
  XAxisTheme,
} from '../../index';
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

  it('re-exports public chart config types from the package root', () => {
    expectTypeOf<ChartConfig>().toMatchTypeOf<{ backgroundColor?: string }>();
    expectTypeOf<ChartConfigComplete>().toHaveProperty('backgroundColor').toEqualTypeOf<string>();

    expectTypeOf<BordersConfig>().toHaveProperty('left');
    expectTypeOf<BordersConfigComplete>().toHaveProperty('left');
    expectTypeOf<BordersTheme>().toHaveProperty('left');

    expectTypeOf<CrosshairsConfig>().toHaveProperty('time');
    expectTypeOf<CrosshairsConfigComplete>().toHaveProperty('time');
    expectTypeOf<CrosshairsTheme>().toHaveProperty('time');

    expectTypeOf<GridConfig>().toHaveProperty('time');
    expectTypeOf<GridConfigComplete>().toHaveProperty('time');
    expectTypeOf<GridTheme>().toHaveProperty('time');

    expectTypeOf<WatermarkConfig>().toHaveProperty('opacity');
    expectTypeOf<WatermarkConfigComplete>().toHaveProperty('opacity').toEqualTypeOf<number>();
    expectTypeOf<WatermarkTheme>().toHaveProperty('opacity').toEqualTypeOf<number>();

    expectTypeOf<XAxisConfig>().toHaveProperty('height');
    expectTypeOf<XAxisConfigComplete>().toHaveProperty('height').toEqualTypeOf<number>();
    expectTypeOf<XAxisTheme>().toHaveProperty('height').toEqualTypeOf<number>();
  });
});
