import { act, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UIs, { UisHandle } from '../UIs';

describe('UIs', () => {
  it('renders panel UI container and forwards imperative updates to panels', () => {
    const ref = createRef<UisHandle>();

    const panels = [
      {
        id: 'p1',
        controls: { goToLatestButton: {} },
        layers: [{ id: 'l1', valueLabelFormatter: (v: number) => `a:${v}`, legend: { left: 0, hPadding: 4, vPadding: 2, backgroundColor: '#000', color: '#fff', borderRadius: 2, label: 'A', fields: [{ output: 'close', label: 'C', color: '#0f0' }] } }],
      },
      {
        id: 'p2',
        controls: { goToLatestButton: {} },
        layers: [{ id: 'l2', valueLabelFormatter: (v: number) => `b:${v}`, legend: { left: 0, hPadding: 4, vPadding: 2, backgroundColor: '#000', color: '#fff', borderRadius: 2, label: 'B', fields: [{ output: 'close', label: 'C', color: '#0f0' }] } }],
      },
    ] as never;

    const { container } = render(
      <UIs
        ref={ref}
        layout={{ drawingAreaX: 1, drawingAreaY: 2, drawingAreaWidth: 300, drawingAreaHeight: 200 } as never}
        panels={panels}
        onGoToLatest={() => {}}
        onButtonMouseEnterLeave={() => {}}
      />,
    );

    act(() => {
      ref.current?.updatePanelMetrics?.({
        p1: { panelMetrics: { topPx: 0, heightPx: 100 }, layerMetricsByScale: {} },
        p2: { panelMetrics: { topPx: 100, heightPx: 100 }, layerMetricsByScale: {} },
      } as never);
    });

    act(() => {
      ref.current?.updateLegends({
        barIndex: 0,
        layerDataInstances: {
          l1: { outputValues: { close: new Float64Array([1]) } },
          l2: { outputValues: { close: new Float64Array([2]) } },
        },
      } as never);
    });
    expect(screen.getByText('a:1')).toBeInTheDocument();
    expect(screen.getByText('b:2')).toBeInTheDocument();

    act(() => {
      ref.current?.updateGoToLatestButton(false);
    });
    expect(screen.queryByRole('button')).toBeNull();

    expect(container.firstElementChild).toHaveStyle({ left: '1px', top: '2px' });
  });
});
