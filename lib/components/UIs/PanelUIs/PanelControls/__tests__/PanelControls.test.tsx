import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import PanelControls, { PanelControlsHandle } from '../PanelControls';

describe('PanelControls', () => {
  it('renders button and handles interactions', () => {
    const onGoToLatestButtonClick = vi.fn();
    const onButtonMouseEnterLeave = vi.fn();
    const ref = createRef<PanelControlsHandle>();

    render(
      <PanelControls
        ref={ref}
        panelMetrics={{ topPx: 10, heightPx: 100 } as never}
        panelControls={{ goToLatestButton: { color: '#fff' } } as never}
        onGoToLatestButtonClick={onGoToLatestButtonClick}
        onButtonMouseEnterLeave={onButtonMouseEnterLeave}
      />,
    );

    const btn = screen.getByRole('button');
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    fireEvent.click(btn);

    expect(onButtonMouseEnterLeave).toHaveBeenNthCalledWith(1, true);
    expect(onButtonMouseEnterLeave).toHaveBeenNthCalledWith(2, false);
    expect(onGoToLatestButtonClick).toHaveBeenCalled();

    act(() => {
      ref.current?.updateGoToLatestButton(false);
    });
    expect(screen.queryByRole('button')).toBeNull();
  });
});
