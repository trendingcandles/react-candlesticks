import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Legend, { LegendHandle } from '../Legend';

describe('Legend', () => {
  it('renders labels and updates values through imperative handle', () => {
    const ref = createRef<LegendHandle>();

    render(
      <Legend
        ref={ref}
        layer={{ id: 'l1', valueLabelFormatter: (v: number) => `v:${v.toFixed(1)}` } as never}
        legend={{
          left: 0,
          hPadding: 4,
          vPadding: 2,
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: 2,
          label: 'Price',
          fields: [
            { output: 'close', label: 'C', color: '#0f0' },
            { output: 'open', label: 'O', color: '#f00' },
          ],
        } as never}
      />,
    );

    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(2);

    ref.current?.update({
      barIndex: 1,
      layerDataInstances: {
        l1: {
          outputValues: {
            close: new Float64Array([1, 2.5]),
            open: new Float64Array([3, Number.NaN]),
          },
        },
      },
    } as never);

    expect(screen.getByText('v:2.5')).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(1);
  });
});
