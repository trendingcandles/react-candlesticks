import PropTypes from 'prop-types';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { Chart as RootChart } from '../index';
import { Chart, chartPropTypes } from '../propTypes';
import type { ChartProps } from '../components/Chart/Chart';

type OptionalPropTypesComponent = {
  propTypes?: unknown;
} & ((props: ChartProps) => unknown);

const validData = [
  { time: '2026-01-01T00:00:00.000Z', open: 1, high: 2, low: 0.5, close: 1.5, volume: 100 },
];

afterEach(() => {
  vi.restoreAllMocks();
  PropTypes.resetWarningCache();
});

describe('prop-types entry', () => {
  it('exposes an opt-in Chart export with propTypes for JS consumers', () => {
    expect(Chart).not.toBe(RootChart);
    expect((Chart as OptionalPropTypesComponent).propTypes).toBe(chartPropTypes);
  });

  it('leaves the default Chart export without runtime propTypes', () => {
    expect((RootChart as OptionalPropTypesComponent).propTypes).toBeUndefined();
  });

  it('warns when neither panels nor children are provided', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    PropTypes.checkPropTypes(
      chartPropTypes,
      { data: validData },
      'prop',
      'Chart',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Chart requires either `panels` or `children` to define at least one panel.'),
    );
  });

  it('warns when both panels and children are provided', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    PropTypes.checkPropTypes(
      chartPropTypes,
      {
        data: validData,
        panels: [{ id: 'p1', layers: [{}] }],
        children: 'child panel config',
      },
      'prop',
      'Chart',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Chart cannot accept both `panels` and `children`.'),
    );
  });

  it('warns when panels is an empty array', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    PropTypes.checkPropTypes(
      chartPropTypes,
      {
        data: validData,
        panels: [],
      },
      'prop',
      'Chart',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Chart expects `panels` to contain at least one panel.'),
    );
  });

  it('accepts valid prop-types usage without warnings', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    PropTypes.checkPropTypes(
      chartPropTypes,
      {
        width: 'auto',
        height: 480,
        theme: 'dark',
        data: validData,
        panels: [{ id: 'p1', layers: [{}] }],
      },
      'prop',
      'Chart',
    );

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
