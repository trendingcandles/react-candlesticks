import { describe, expect, it } from 'vitest';
import parseBordersConfig from '../borders/parseBordersConfig';
import parseGridConfig from '../grid/parseGridConfig';
import parseXAxisConfig from '../xAxis/parseXAxisConfig';
import parseValueCrosshairConfig from '../crosshairs/valueCrosshair/parseValueCrosshairConfig';
import parseTimeCrosshairConfig from '../crosshairs/timeCrosshair/parseTimeCrosshairConfig';
import parseCrosshairsConfig from '../crosshairs/parseCrosshairsConfig';
import parseChartConfig from '../parseChartConfig';
import defaultLightTheme from '../../../themes/defaultLightTheme';

describe('chart config parsers', () => {
  it('parses borders/grid and handles false', () => {
    expect(parseBordersConfig(false)).toBeNull();
    expect(parseGridConfig(false, defaultLightTheme.chart.grid)).toBeNull();

    const borders = parseBordersConfig({ left: false, right: { color: 'red' } }, defaultLightTheme.chart.borders);
    expect(borders?.left).toBeNull();
    expect(borders?.right?.color).toBe('red');
  });

  it('parses xAxis and validates height', () => {
    expect(() => parseXAxisConfig({ height: 0 }, defaultLightTheme.chart.xAxis)).toThrow('xAxis.height must be > 0');
    const xAxis = parseXAxisConfig({}, defaultLightTheme.chart.xAxis, 'UTC');
    expect(xAxis?.timeZoneId).toBe('UTC');
  });

  it('parses crosshairs and chart config', () => {
    expect(parseValueCrosshairConfig(false, defaultLightTheme.chart.crosshairs.value)).toBeNull();
    expect(parseTimeCrosshairConfig(false, defaultLightTheme.chart.crosshairs.time)).toBeNull();
    const crosshairs = parseCrosshairsConfig({ value: false }, defaultLightTheme.chart.crosshairs);
    expect(crosshairs?.value).toBeNull();

    const chart = parseChartConfig({ backgroundColor: 'black', grid: false }, defaultLightTheme, 'UTC');
    expect(chart.backgroundColor).toBe('black');
    expect(chart.grid).toBeNull();
  });
});
