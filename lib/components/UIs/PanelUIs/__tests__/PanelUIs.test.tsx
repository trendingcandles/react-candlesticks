import { act, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PanelUIs, { PanelUIsHandle } from '../PanelUIs';

describe('PanelUIs', () => {
  it('renders legends/controls and supports imperative updates', async () => {
    const ref = createRef<PanelUIsHandle>();

    render(
      <PanelUIs
        ref={ref}
        panel={{
          id: 'p1',
          controls: { goToLatestButton: {} },
          layers: [
            {
              id: 'l1',
              valueLabelFormatter: (v: number) => `v:${v}`,
              legend: {
                left: 0,
                hPadding: 4,
                vPadding: 2,
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: 2,
                label: 'L1',
                fields: [{ output: 'close', label: 'C', color: '#0f0' }],
              },
            },
          ],
        } as never}
        panelMetrics={{ topPx: 10, heightPx: 100 } as never}
        onGoToLatest={() => {}}
        onButtonMouseEnterLeave={() => {}}
      />,
    );

    expect(screen.getByText('L1')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();

    await act(async () => {
      await Promise.resolve();
      ref.current?.updateLegends({
        barIndex: 0,
        layerDataInstances: { l1: { outputValues: { close: new Float64Array([12]) } } },
      } as never);
    });
    expect(screen.getByText('-')).toBeInTheDocument();

    act(() => {
      ref.current?.updateGoToLatestButton(false);
    });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('returns empty when panel metrics missing', () => {
    const { container } = render(
      <PanelUIs
        ref={createRef<PanelUIsHandle>()}
        panel={{ id: 'p1', controls: {}, layers: [{ id: 'l1', legend: {} }] } as never}
        onGoToLatest={() => {}}
        onButtonMouseEnterLeave={() => {}}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
