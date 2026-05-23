// import PropTypes from 'prop-types';
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { StatefulChartProps } from '../../StatefulChart/StatefulChart';
// import chartPropTypes from '../chartPropTypes';

const parseChartConfigMock = vi.hoisted(() => vi.fn(() => ({ backgroundColor: 'black' })));
const parsePanelConfigsMock = vi.hoisted(() => vi.fn(() => [{ id: 'p1', layers: [{ indicator: false }], controls: {} }]));
const createLayerTopologyMock = vi.hoisted(() => vi.fn(() => ({ deducedLayerScales: {} })));
const setPanelYAxesMock = vi.hoisted(() => vi.fn((panels) => panels));
const getLayoutMock = vi.hoisted(() => vi.fn(() => ({ drawingAreaWidth: 500, dpr: 2 })));
const createIndexProviderMock = vi.hoisted(() => vi.fn(() => ({ dataMap: { rawData: [] }, barsLength: 10 })));
const createLayersDataMock = vi.hoisted(() => vi.fn(() => ({ layerDataInstances: {} })));
const deduceGranularityMock = vi.hoisted(() => vi.fn(() => 'm1'));
const parseComponentsMock = vi.hoisted(() => vi.fn(() => [{ id: 'p-from-children' }]));
let capturedProps: StatefulChartProps | null = null;

vi.mock('../../../hooks/useResizeObserver', () => ({
  default: () => [{ width: 600, height: 400 }, { current: null }],
}));
vi.mock('../../../hooks/useDevicePixelRatio', () => ({ default: () => 2 }));
vi.mock('../../../config/chart/parseChartConfig', () => ({ default: parseChartConfigMock }));
vi.mock('../../../config/panel/parsePanelConfigs', () => ({ default: parsePanelConfigsMock }));
vi.mock('../../../config/layer/createLayerTopology', () => ({ default: createLayerTopologyMock }));
vi.mock('../../../config/panel/setPanelYAxes', () => ({ default: setPanelYAxesMock }));
vi.mock('../../../layout/getLayout', () => ({ default: getLayoutMock }));
vi.mock('../../../indexProviders/continuous/createContinuousIndexProvider', () => ({ default: createIndexProviderMock }));
vi.mock('../../../data/layers/createLayersData', () => ({ createLayersData: createLayersDataMock }));
vi.mock('../../../data/utils/deduceGranulairty', () => ({ default: deduceGranularityMock }));
vi.mock('../parseConfigComponents', () => ({ default: parseComponentsMock }));
vi.mock('../../StatefulChart', () => ({
  default: (props: StatefulChartProps) => {
    capturedProps = props;
    return <div data-testid="stateful-chart" />;
  },
}));

import Chart from '../Chart';

describe('Chart', () => {
  beforeEach(() => {
    capturedProps = null;
    parseChartConfigMock.mockClear();
    parsePanelConfigsMock.mockClear();
    createLayerTopologyMock.mockClear();
    setPanelYAxesMock.mockClear();
    getLayoutMock.mockClear();
    createIndexProviderMock.mockClear();
    createLayersDataMock.mockClear();
    deduceGranularityMock.mockClear();
    parseComponentsMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws when no panels are provided', () => {
    expect(() => render(<Chart data={[]} /> as never)).toThrow('Chart requires at least one panel');
  });

  it('renders with empty data when panels and explicit granularity are provided', () => {
    render(
      <Chart
        data={[]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
        granularity="m5"
      />,
    );

    expect(capturedProps?.granularity).toBe('m5');
  });

  it('falls back to a safe default granularity for single-point data', () => {
    render(
      <Chart
        data={[{ time: '2026-01-01T00:00:00.000Z', open: 1, high: 1, low: 1, close: 1, volume: 1 }]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
      />,
    );

    expect(capturedProps?.granularity).toBe('m1');
    expect(deduceGranularityMock).not.toHaveBeenCalled();
  });

  it('renders StatefulChart and uses parsed panel/config dependencies', () => {
    render(
      <Chart
        data={[{ timestamp: 1 } as never]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
        granularity="m5"
      />,
    );

    expect(parseChartConfigMock).toHaveBeenCalled();
    expect(parsePanelConfigsMock).toHaveBeenCalled();
    expect(createIndexProviderMock).toHaveBeenCalled();
    expect(capturedProps?.chartWidth).toBe(600);
    expect(capturedProps?.granularity).toBe('m5');
  });

  it('forwards borders config into chart config parsing', () => {
    const borders = { right: { color: '#f00', width: 2, style: 'solid' } };

    render(
      <Chart
        data={[{ timestamp: 1 } as never]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
        borders={borders as never}
      />,
    );

    expect(parseChartConfigMock).toHaveBeenCalledWith(
      expect.objectContaining({ borders }),
      expect.anything(),
      expect.anything(),
    );
  });

  it('forwards initialScrollToLatest to StatefulChart', () => {
    render(
      <Chart
        data={[{ timestamp: 1 } as never]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
        initialScrollToLatest
      />,
    );

    expect(capturedProps?.initialScrollToLatest).toBe(true);
  });

  it('forwards interaction toggle props to StatefulChart', () => {
    render(
      <Chart
        data={[{ timestamp: 1 } as never]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
        enableScroll={false}
        enableZoom={false}
      />,
    );

    expect(capturedProps?.enableScroll).toBe(false);
    expect(capturedProps?.enableZoom).toBe(false);
  });

  it('can build panels from children when panels prop is absent', () => {
    render(
      <Chart data={[{ timestamp: 1 } as never]}>
        <div />
      </Chart>,
    );

    expect(parseComponentsMock).toHaveBeenCalled();
    expect(capturedProps?.panels[0].id).toBe('p1');
  });

  it('debounces and rounds zoom callback notifications', () => {
    vi.useFakeTimers();

    const onZoom = vi.fn();

    render(
      <Chart
        data={[{ timestamp: 1 } as never]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
        granularity="m5"
        onZoom={onZoom}
      />,
    );

    act(() => {
      capturedProps?.onZoom?.(12.6);
      capturedProps?.onZoom?.(12.8);
      vi.advanceTimersByTime(149);
    });

    expect(onZoom).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onZoom).toHaveBeenCalledTimes(1);
    expect(onZoom).toHaveBeenCalledWith(13);

    act(() => {
      capturedProps?.onZoom?.(13.2);
      vi.advanceTimersByTime(150);
    });

    expect(onZoom).toHaveBeenCalledTimes(1);
  });

  it('deduces granularity from multi-point data when none is provided', () => {
    render(
      <Chart
        data={[
          { time: '2026-01-01T00:00:00.000Z', open: 1, high: 1, low: 1, close: 1, volume: 1 },
          { time: '2026-01-01T00:05:00.000Z', open: 2, high: 2, low: 2, close: 2, volume: 2 },
        ]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
      />,
    );

    expect(deduceGranularityMock).toHaveBeenCalled();
    expect(capturedProps?.granularity).toBe('m1');
  });

  it('clears a pending zoom timeout on unmount', () => {
    vi.useFakeTimers();

    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const onZoom = vi.fn();

    const { unmount } = render(
      <Chart
        data={[{ timestamp: 1 } as never]}
        panels={[{ id: 'p1', layers: [{}] }] as never}
        granularity="m5"
        onZoom={onZoom}
      />,
    );

    act(() => {
      capturedProps?.onZoom?.(15.2);
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  // it('warns when both panels and children are provided', () => {
  //   const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  //   PropTypes.resetWarningCache();
  //   PropTypes.checkPropTypes(
  //     chartPropTypes,
  //     {
  //       data: [{ timestamp: 1 }],
  //       panels: [{ id: 'p1', layers: [{}] }],
  //       children: <div />,
  //     },
  //     'prop',
  //     'Chart',
  //   );

  //   expect(consoleErrorSpy).toHaveBeenCalledWith(
  //     expect.stringContaining('cannot accept both `panels` and `children`'),
  //   );

  //   consoleErrorSpy.mockRestore();
  // });
});
