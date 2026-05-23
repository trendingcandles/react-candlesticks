import { render } from '@testing-library/react';
import { forwardRef, useImperativeHandle } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StatefulChartProps } from '../StatefulChart';

const requestDrawMock = vi.hoisted(() => vi.fn());
const requestDrawCrosshairsMock = vi.hoisted(() => vi.fn());
const hideCrosshairsMock = vi.hoisted(() => vi.fn());
const updateCrosshairsCanvasMock = vi.hoisted(() => vi.fn());
const updateGoToLatestButtonMock = vi.hoisted(() => vi.fn());

let interactiveProps: { onScroll: (dx: number, dy: number) => void; onMouseMove: (x: number, y: number) => void; onZoom: (z: number) => void; enableScroll: boolean; enableZoom: boolean } | null = null;
let uiProps: { onGoToLatest: () => void; onButtonMouseEnterLeave: (enter: boolean) => void } | null = null;

const getViewportDataMock = vi.hoisted(() => vi.fn(() => ({ data: [], timeScale: { startBarIndex: 0, endBarIndex: 1 }, xToDataPoint: () => null })));
const updateLayersDataMock = vi.hoisted(() => vi.fn());
const calcOffsetMock = vi.hoisted(() => vi.fn(() => 15));

vi.mock('../../ChartCanvases', () => ({
  default: forwardRef((_props, ref) => {
    useImperativeHandle(ref, () => ({
      requestDraw: requestDrawMock,
      requestDrawCrosshairs: requestDrawCrosshairsMock,
      hideCrosshairs: hideCrosshairsMock,
      updateCrosshairsCanvas: updateCrosshairsCanvasMock,
    }));
    return <div data-testid="canvases" />;
  }),
}));

vi.mock('../../InteractiveArea', () => ({
  default: (props: { onScroll: (dx: number, dy: number) => void; onMouseMove: (x: number, y: number) => void; onZoom: (z: number) => void; enableScroll: boolean; enableZoom: boolean }) => {
    interactiveProps = props;
    return <div data-testid="interactive" />;
  },
}));

vi.mock('../../UIs/UIs', () => ({
  default: forwardRef((props: { onGoToLatest: () => void; onButtonMouseEnterLeave: (enter: boolean) => void }, ref) => {
    uiProps = props;
    useImperativeHandle(ref, () => ({
      updatePanelMetrics: vi.fn(),
      updateLegends: vi.fn(),
      updateGoToLatestButton: updateGoToLatestButtonMock,
    }));
    return <div data-testid="uis" />;
  }),
}));

vi.mock('../../../utils/throttle', () => ({ default: (fn: unknown) => fn }));
vi.mock('../../../data/layers/updateLayersData', () => ({ updateLayersData: updateLayersDataMock }));
vi.mock('../getViewportData', () => ({ default: getViewportDataMock }));
vi.mock('../../../timeScale/core/calculateNewScrollOffset', () => ({ default: calcOffsetMock }));

import StatefulChart from '../StatefulChart';

describe('StatefulChart', () => {
  beforeEach(() => {
    requestDrawMock.mockClear();
    requestDrawCrosshairsMock.mockClear();
    hideCrosshairsMock.mockClear();
    updateCrosshairsCanvasMock.mockClear();
    updateGoToLatestButtonMock.mockClear();
    getViewportDataMock.mockClear();
    updateLayersDataMock.mockClear();
    calcOffsetMock.mockClear();
    interactiveProps = null;
    uiProps = null;
  });

  const makeProps = (): StatefulChartProps => ({
    chartWidth: 600,
    chartHeight: 400,
    intervalSize: 10,
    granularity: 'm1',
    config: { backgroundColor: '#000' } as never,
    panels: [{ id: 'p1' }] as never,
    layout: { drawingAreaWidth: 500, drawingAreaX: 0 } as never,
    indexProvider: {
      firstDataPointIndex: 0,
      lastDataPointIndex: 50,
      indexToTimestamp: () => 1,
      findClosestIndex: () => 1,
      getTimescale: () => ({ startBarIndex: 0, endBarIndex: 10 }),
    } as never,
    dataMap: {} as never,
    initialLayersData: { layerDataInstances: {} } as never,
    maxLookback: 5,
    maxLookForward: 2,
    scrollToLatestMargin: 5,
    initialScrollToLatest: false,
    onScroll: vi.fn(),
    onZoom: vi.fn(),
    enableScroll: true,
    enableZoom: true,
  });

  it('initializes and requests draw on mount', () => {
    render(<StatefulChart {...makeProps()} />);

    expect(getViewportDataMock).toHaveBeenCalled();
    expect(requestDrawMock).toHaveBeenCalled();
    expect(updateCrosshairsCanvasMock).toHaveBeenCalled();
    expect(interactiveProps?.enableScroll).toBe(true);
    expect(interactiveProps?.enableZoom).toBe(true);
  });

  it('handles scroll, zoom and go-to-latest callbacks', () => {
    const props = makeProps();
    render(<StatefulChart {...props} />);

    interactiveProps?.onScroll(20, 0);
    interactiveProps?.onZoom(1.1);
    uiProps?.onGoToLatest();
    uiProps?.onButtonMouseEnterLeave(true);
    interactiveProps?.onMouseMove(100, 120);

    expect(calcOffsetMock).toHaveBeenCalled();
    expect(props.onScroll).toHaveBeenCalled();
    expect(props.onZoom).toHaveBeenCalled();
    expect(hideCrosshairsMock).toHaveBeenCalled();
    expect(requestDrawCrosshairsMock).toHaveBeenCalled();
    expect(updateLayersDataMock).toHaveBeenCalled();
  });

  it('updates latest-button visibility for a single-bar dataset', () => {
    render(
      <StatefulChart
        {...makeProps()}
        indexProvider={{
          firstDataPointIndex: 0,
          lastDataPointIndex: 0,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: () => ({ startBarIndex: 0, endBarIndex: 1 }),
        } as never}
      />,
    );

    expect(updateGoToLatestButtonMock).toHaveBeenCalled();
  });

  it('clamps zoom to a minimum interval size of 1', () => {
    const props = makeProps();
    render(<StatefulChart {...props} intervalSize={2} />);

    interactiveProps?.onZoom(0.1);

    expect(props.onZoom).toHaveBeenCalledWith(1);
  });

  it('hides crosshairs when the go-to-latest button is used after hovering', () => {
    render(<StatefulChart {...makeProps()} />);

    interactiveProps?.onMouseMove(100, 120);
    uiProps?.onGoToLatest();

    expect(requestDrawCrosshairsMock).toHaveBeenCalled();
    expect(hideCrosshairsMock).toHaveBeenCalled();
  });

  it('hides crosshairs while the button is hovered and redraws after leaving', () => {
    render(<StatefulChart {...makeProps()} />);

    interactiveProps?.onMouseMove(100, 120);
    uiProps?.onButtonMouseEnterLeave(true);
    uiProps?.onButtonMouseEnterLeave(false);
    interactiveProps?.onMouseMove(130, 140);

    expect(hideCrosshairsMock).toHaveBeenCalled();
    expect(requestDrawCrosshairsMock).toHaveBeenCalledTimes(2);
  });

  it('recalculates offsets when granularity changes and index bounds are missing', () => {
    const props = makeProps();
    const { rerender } = render(
      <StatefulChart
        {...props}
        indexProvider={{
          firstDataPointIndex: undefined,
          lastDataPointIndex: undefined,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: () => ({ startBarIndex: 0, endBarIndex: 1 }),
        } as never}
      />,
    );

    rerender(
      <StatefulChart
        {...props}
        granularity="m5"
        indexProvider={{
          firstDataPointIndex: undefined,
          lastDataPointIndex: undefined,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: () => ({ startBarIndex: 0, endBarIndex: 1 }),
        } as never}
      />,
    );

    expect(calcOffsetMock).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      expect.any(Function),
      expect.any(Function),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      true,
      0,
      0,
    );
  });

  it('goes to origin when no latest data point is available', () => {
    render(
      <StatefulChart
        {...makeProps()}
        indexProvider={{
          firstDataPointIndex: undefined,
          lastDataPointIndex: undefined,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: () => ({ startBarIndex: 0, endBarIndex: 1 }),
        } as never}
      />,
    );

    uiProps?.onGoToLatest();

    expect(calcOffsetMock).toHaveBeenLastCalledWith(
      expect.anything(),
      -15,
      expect.any(Function),
      expect.any(Function),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      false,
      0,
      0,
    );
  });

  it('can initialize scrolled to latest when requested', () => {
    const getTimescale = vi.fn(() => ({ startBarIndex: 0, endBarIndex: 10 }));
    render(
      <StatefulChart
        {...makeProps()}
        initialScrollToLatest
        indexProvider={{
          firstDataPointIndex: 0,
          lastDataPointIndex: 50,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale,
        } as never}
      />,
    );

    expect(getTimescale).toHaveBeenCalledWith(10, 50, 500);
  });

  it('auto-scrolls to latest when data becomes available after mount', () => {
    const props = makeProps();
    const initialGetTimescale = vi.fn(() => ({ startBarIndex: 0, endBarIndex: 1 }));
    const latestGetTimescale = vi.fn(() => ({ startBarIndex: 0, endBarIndex: 10 }));

    const { rerender } = render(
      <StatefulChart
        {...props}
        initialScrollToLatest
        indexProvider={{
          firstDataPointIndex: undefined,
          lastDataPointIndex: undefined,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: initialGetTimescale,
        } as never}
      />,
    );

    rerender(
      <StatefulChart
        {...props}
        initialScrollToLatest
        indexProvider={{
          firstDataPointIndex: 0,
          lastDataPointIndex: 50,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: latestGetTimescale,
        } as never}
      />,
    );

    expect(latestGetTimescale).toHaveBeenCalledWith(10, 50, 500);
  });

  it('does not auto-scroll to latest after user interaction', () => {
    const props = makeProps();
    const latestGetTimescale = vi.fn(() => ({ startBarIndex: 0, endBarIndex: 10 }));

    const { rerender } = render(
      <StatefulChart
        {...props}
        initialScrollToLatest
        indexProvider={{
          firstDataPointIndex: undefined,
          lastDataPointIndex: undefined,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: () => ({ startBarIndex: 0, endBarIndex: 1 }),
        } as never}
      />,
    );

    interactiveProps?.onScroll(20, 0);

    rerender(
      <StatefulChart
        {...props}
        initialScrollToLatest
        indexProvider={{
          firstDataPointIndex: 0,
          lastDataPointIndex: 50,
          indexToTimestamp: () => 1,
          findClosestIndex: () => 1,
          getTimescale: latestGetTimescale,
        } as never}
      />,
    );

    expect(latestGetTimescale).toHaveBeenCalledWith(10, 15, 500);
  });
});
