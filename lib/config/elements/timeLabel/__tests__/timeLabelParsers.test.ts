import { describe, expect, it } from 'vitest';
import parseTimeLabelConfig from '../parseTimeLabelConfig';
import parseBoxedTimeLabelConfig from '../../boxedTimeLabel/parseBoxedTimeLabelConfig';
import defaultTimeLabelFormatter from '../defaultTimeLabelFormatter';
import defaultTimeCrosshairLabelFormatter from '../../../chart/crosshairs/timeCrosshair/timeCrosshairLabel/defaultTimeCrosshairLabelFormatter';
import parseTimeCrosshairLabelConfig from '../../../chart/crosshairs/timeCrosshair/timeCrosshairLabel/parseTimeCrosshairLabelConfig';
import parseValueCrosshairLabelConfig from '../../../chart/crosshairs/valueCrosshair/valueCrosshairLabel/parseValueCrosshairLabelConfig';
import { themeDefaultLabel } from '../../label/LabelConfig';
import { boxedTimeLabelDefaults } from '../../boxedTimeLabel/BoxedTimeLabelConfig';
import { valueCrosshairLabelDefaults } from '../../../chart/crosshairs/valueCrosshair/valueCrosshairLabel/ValueCrosshairLabelConfig';

describe('time label parsers and formatters', () => {
  it('parses time label and boxed time label', () => {
    expect(parseTimeLabelConfig(false, { ...themeDefaultLabel, top: 3 })).toBeNull();
    const timeLabel = parseTimeLabelConfig({ top: 11 }, { ...themeDefaultLabel, top: 3 });
    expect(timeLabel?.top).toBe(11);

    expect(parseBoxedTimeLabelConfig(false, boxedTimeLabelDefaults)).toBeNull();
    expect(parseBoxedTimeLabelConfig({}, boxedTimeLabelDefaults)?.borderWidth).toBe(boxedTimeLabelDefaults.borderWidth);
  });

  it('formats default time labels and crosshair labels', () => {
    const ts = Date.UTC(2024, 0, 2, 9, 5);
    expect(defaultTimeLabelFormatter({ utcTs: ts, timeUnit: 'minute', kind: 'minor' })).toBe('09:05');
    expect(defaultTimeCrosshairLabelFormatter({ utcTs: ts, timeUnit: 'day' })).toBe("Tue 2 Jan '24");
    expect(defaultTimeCrosshairLabelFormatter({ utcTs: ts, timeUnit: 'minute' })).toBe("Tue 2 Jan '24 09:05");
  });

  it('parses crosshair label configs', () => {
    expect(parseTimeCrosshairLabelConfig(false, boxedTimeLabelDefaults)).toBeNull();
    expect(parseValueCrosshairLabelConfig(false, valueCrosshairLabelDefaults)).toBeNull();

    const parsed = parseTimeCrosshairLabelConfig({}, boxedTimeLabelDefaults);
    expect(typeof parsed?.formatter).toBe('function');
  });
});
