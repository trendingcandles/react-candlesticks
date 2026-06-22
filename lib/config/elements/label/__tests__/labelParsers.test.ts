import { describe, expect, it } from 'vitest';
import parseLabelConfig from '../parseLabelConfig';
import parseValueLabelConfig from '../../valueLabel/parseValueLabelConfig';
import parseBoxedValueLabelConfig from '../../boxedValueLabel/parseBoxedValueLabelConfig';
import parseButtonConfig from '../../button/parseButtonConfig';
import { labelDefaults } from '../LabelConfig';
import { boxedValueLabelDefaults } from '../../boxedValueLabel/BoxedValueLabelConfig';
import { buttonDefaults } from '../../button/ButtonConfig';

describe('label and boxed parsers', () => {
  it('parses base label config', () => {
    const label = parseLabelConfig({ color: 'orange' }, labelDefaults);
    expect(label.color).toBe('orange');
    expect(label.fontFamily).toBe(labelDefaults.fontFamily);
  });

  it('parses value labels and handles false', () => {
    expect(parseValueLabelConfig(false, { ...labelDefaults, padding: 4 })).toBeNull();
    const parsed = parseValueLabelConfig({}, { ...labelDefaults, padding: 9 });
    expect(parsed?.padding).toBe(9);
  });

  it('parses boxed value labels and buttons', () => {
    expect(parseBoxedValueLabelConfig(false, boxedValueLabelDefaults)).toBeNull();
    const boxed = parseBoxedValueLabelConfig({ borderRadius: 3 }, boxedValueLabelDefaults, 'rebeccapurple');
    expect(boxed?.backgroundColor).toBe('rebeccapurple');
    expect(boxed?.borderRadius).toBe(3);

    expect(parseButtonConfig(false, buttonDefaults)).toBeNull();
    expect(parseButtonConfig({}, buttonDefaults)?.backgroundColor).toBe(buttonDefaults.backgroundColor);
  });
});
