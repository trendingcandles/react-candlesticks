import { describe, expect, it } from 'vitest';
import defaultLightTheme from '../defaultLightTheme';
import defaultDarkTheme from '../defaultDarkTheme';
import themes from '../themes';

describe('themes exports', () => {
  it('exports both light and dark themes map', () => {
    expect(themes.light).toBe(defaultLightTheme);
    expect(themes.dark).toBe(defaultDarkTheme);
  });
});

describe('defaultLightTheme', () => {
  it('has expected chart defaults and layer palette', () => {
    expect(defaultLightTheme.chart.backgroundColor).toBe('white');
    expect(defaultLightTheme.chart.xAxis?.height).toBe(60);
    expect(defaultLightTheme.chart.grid?.time?.color).toBe('#ccc');
    expect(defaultLightTheme.chart.crosshairs?.time?.line?.style).toBe('dashed');

    expect(defaultLightTheme.layers.candlesticks.series.body.up.backgroundColor).toBe('#10b981');
    expect(defaultLightTheme.layers.candlesticks.series.body.down.backgroundColor).toBe('#ef4444');
    expect(defaultLightTheme.layers.priceLine.series.value.endDotSize).toBe(5);
    expect(defaultLightTheme.layers.stochastic.legend.fields).toHaveLength(2);
  });

  it('defines panel defaults and value marker labels', () => {
    expect(defaultLightTheme.panels.paddingTop).toBe(16);
    expect(defaultLightTheme.panels.borderTop?.width).toBe(2);
    expect(defaultLightTheme.layers.volumeBars.markers.value.label.hPadding).toBe(8);
    expect(defaultLightTheme.layers.sma.markers.value.label.backgroundColor).toBe('orange');
  });
});

describe('defaultDarkTheme', () => {
  it('has expected chart defaults and border styling', () => {
    expect(defaultDarkTheme.chart.backgroundColor).toBe('#1a1a1a');
    expect(defaultDarkTheme.chart.borders?.left?.color).toBe('#333');
    expect(defaultDarkTheme.chart.grid?.value?.color).toBe('#2e2e2e');
    expect(defaultDarkTheme.chart.crosshairs?.value?.line?.style).toBe('dashed');

    expect(defaultDarkTheme.layers.candlesticks.series.wick.flat.color).toBe('#aaa');
    expect(defaultDarkTheme.layers.volumeBars.series.bars.flat.backgroundColor).toBe('#555');
    expect(defaultDarkTheme.layers.sma.series.value.color).toBe('orange');
    expect(defaultDarkTheme.layers.stochastic.series.k.color).toBe('#ddd');
  });

  it('defines panel controls and directional markers', () => {
    expect(defaultDarkTheme.panels.controls?.goToLatestButton?.backgroundColor).toBe('#2e2e2e');
    expect(defaultDarkTheme.layers.candlesticks.markers.value.up.label.borderColor).toBe('#10b981');
    expect(defaultDarkTheme.layers.candlesticks.markers.value.down.line.color).toBe('#ef4444');
    expect(defaultDarkTheme.layers.priceLine.markers.value.line.color).toBe('dodgerblue');
  });
});
