import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import InteractiveArea from '../InteractiveArea';

describe('InteractiveArea', () => {
  const dispatchPointerEvent = (
    area: HTMLElement,
    type: string,
    {
      pointerId,
      pointerType,
      clientX,
      clientY,
      button = 0,
    }: {
      pointerId: number;
      pointerType: string;
      clientX: number;
      clientY: number;
      button?: number;
    },
  ) => {
    const event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      button,
    });

    Object.defineProperties(event, {
      pointerId: { value: pointerId },
      pointerType: { value: pointerType },
    });

    fireEvent(area, event);
  };

  const dispatchWindowPointerEvent = (
    type: string,
    pointerId: number,
  ) => {
    const event = new Event(type);
    Object.defineProperty(event, 'pointerId', { value: pointerId });
    window.dispatchEvent(event);
  };

  const mockPointerCapture = (area: HTMLElement) => {
    let capturedPointerId: number | null = null;

    area.setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointerId = pointerId;
    });
    area.releasePointerCapture = vi.fn((pointerId: number) => {
      if (capturedPointerId === pointerId) {
        capturedPointerId = null;
      }
    });
    area.hasPointerCapture = vi.fn((pointerId: number) => capturedPointerId === pointerId);
  };

  const mockRaf = () => (
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    })
  );

  const mockQueuedRaf = () => {
    let frameId = 0;
    return vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
      frameId += 1;
      return frameId;
    });
  };

  it('handles pointer drag scroll and hover movement', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    fireEvent.mouseMove(area, { clientX: 8, clientY: 9 });
    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'mouse', button: 0 });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 1, clientX: 15, clientY: 12, pointerType: 'mouse' });
    dispatchPointerEvent(area, 'pointerup', { pointerId: 1, clientX: 15, clientY: 12, pointerType: 'mouse' });

    expect(onMouseMove).toHaveBeenCalledOnce();
    expect(onMouseMove).toHaveBeenCalledWith(8, 9);
    expect(onScroll).toHaveBeenCalledWith(5, 2);

    raf.mockRestore();
  });

  it('supports touch drag and pinch zoom via pointer events', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 1, clientX: 18, clientY: 13, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointerdown', { pointerId: 2, clientX: 38, clientY: 13, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 2, clientX: 48, clientY: 13, pointerType: 'touch' });

    expect(onScroll).toHaveBeenCalledWith(8, 3);
    expect(onZoom).toHaveBeenCalledWith(1.5);

    raf.mockRestore();
  });

  it('lets pointer drag handlers claim a drag instead of scrolling', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onClick = vi.fn();
    const onZoom = vi.fn();
    const onPointerDragStart = vi.fn(() => true);
    const onPointerDragMove = vi.fn();
    const onPointerDragEnd = vi.fn();

    const raf = mockRaf();

    const { container } = render(
      <InteractiveArea
        onScroll={onScroll}
        onMouseMove={onMouseMove}
        onClick={onClick}
        onPointerDragStart={onPointerDragStart}
        onPointerDragMove={onPointerDragMove}
        onPointerDragEnd={onPointerDragEnd}
        onZoom={onZoom}
        enableScroll
        enableZoom
      />,
    );
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'mouse', button: 0 });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 1, clientX: 20, clientY: 15, pointerType: 'mouse' });
    dispatchPointerEvent(area, 'pointerup', { pointerId: 1, clientX: 20, clientY: 15, pointerType: 'mouse' });
    fireEvent.click(area, { clientX: 20, clientY: 15 });

    expect(onPointerDragStart).toHaveBeenCalledWith(10, 10);
    expect(onPointerDragMove).toHaveBeenCalledWith(20, 15);
    expect(onPointerDragEnd).toHaveBeenCalledWith(20, 15);
    expect(onScroll).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();

    raf.mockRestore();
  });

  it('keeps a claimed drag active when the cursor prop changes', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();
    const onPointerDragStart = vi.fn(() => true);
    const onPointerDragMove = vi.fn();
    const onPointerDragEnd = vi.fn();

    const raf = mockRaf();

    const { container, rerender } = render(
      <InteractiveArea
        onScroll={onScroll}
        onMouseMove={onMouseMove}
        onPointerDragStart={onPointerDragStart}
        onPointerDragMove={onPointerDragMove}
        onPointerDragEnd={onPointerDragEnd}
        onZoom={onZoom}
        enableScroll
        enableZoom
      />,
    );
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'mouse', button: 0 });
    rerender(
      <InteractiveArea
        onScroll={onScroll}
        onMouseMove={onMouseMove}
        onPointerDragStart={onPointerDragStart}
        onPointerDragMove={onPointerDragMove}
        onPointerDragEnd={onPointerDragEnd}
        cursor="grabbing"
        onZoom={onZoom}
        enableScroll
        enableZoom
      />,
    );
    dispatchPointerEvent(area, 'pointermove', { pointerId: 1, clientX: 20, clientY: 15, pointerType: 'mouse' });
    dispatchPointerEvent(area, 'pointerup', { pointerId: 1, clientX: 20, clientY: 15, pointerType: 'mouse' });

    expect(onPointerDragMove).toHaveBeenCalledWith(20, 15);
    expect(onPointerDragEnd).toHaveBeenCalledWith(20, 15);
    expect(onScroll).not.toHaveBeenCalled();

    raf.mockRestore();
  });

  it('routes wheel gesture to scroll (horizontal) and zoom (vertical)', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom />);
    const area = container.firstElementChild as HTMLElement;

    fireEvent.wheel(area, { deltaX: 20, deltaY: 1 });
    fireEvent.wheel(area, { deltaX: 1, deltaY: -30 });

    expect(onScroll).toHaveBeenCalledWith(-20, 0, true);
    expect(onZoom).toHaveBeenCalled();

    raf.mockRestore();
  });

  it('ignores non-primary mouse drags', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'mouse', button: 2 });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 1, clientX: 20, clientY: 15, pointerType: 'mouse' });

    expect(onScroll).not.toHaveBeenCalled();
    expect(area.setPointerCapture).not.toHaveBeenCalled();

    raf.mockRestore();
  });

  it('restores hover tracking after pointer cancellation', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointercancel', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'touch' });
    fireEvent.mouseMove(area, { clientX: 30, clientY: 40 });

    expect(area.setPointerCapture).toHaveBeenCalledWith(1);
    expect(area.releasePointerCapture).toHaveBeenCalledWith(1);
    expect(onMouseMove).toHaveBeenCalledWith(30, 40);

    raf.mockRestore();
  });

  it('continues dragging with the remaining touch after a window pointerup', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointerdown', { pointerId: 2, clientX: 30, clientY: 10, pointerType: 'touch' });
    dispatchWindowPointerEvent('pointerup', 1);
    dispatchPointerEvent(area, 'pointermove', { pointerId: 2, clientX: 36, clientY: 16, pointerType: 'touch' });

    expect(onScroll).toHaveBeenCalledWith(6, 6);

    raf.mockRestore();
  });

  it('cancels queued animation frames on unmount', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockQueuedRaf();
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { container, unmount } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 1, clientX: 20, clientY: 15, pointerType: 'touch' });
    fireEvent.wheel(area, { deltaX: 1, deltaY: -30 });

    unmount();

    expect(cancelSpy).toHaveBeenCalled();

    raf.mockRestore();
  });

  it('disables scroll interactions when enableScroll is false', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll={false} enableZoom />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'mouse', button: 0 });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 1, clientX: 15, clientY: 12, pointerType: 'mouse' });
    fireEvent.wheel(area, { deltaX: 20, deltaY: 1 });

    expect(onScroll).not.toHaveBeenCalled();

    raf.mockRestore();
  });

  it('disables zoom interactions when enableZoom is false', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const raf = mockRaf();

    const { container } = render(<InteractiveArea onScroll={onScroll} onMouseMove={onMouseMove} onZoom={onZoom} enableScroll enableZoom={false} />);
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointerdown', { pointerId: 2, clientX: 38, clientY: 13, pointerType: 'touch' });
    dispatchPointerEvent(area, 'pointermove', { pointerId: 2, clientX: 48, clientY: 13, pointerType: 'touch' });
    fireEvent.wheel(area, { deltaX: 1, deltaY: -30 });

    expect(onZoom).not.toHaveBeenCalled();

    raf.mockRestore();
  });

  it('keeps crosshair cursor on click when both scroll and zoom are disabled', () => {
    const onScroll = vi.fn();
    const onMouseMove = vi.fn();
    const onZoom = vi.fn();

    const { container } = render(
      <InteractiveArea
        onScroll={onScroll}
        onMouseMove={onMouseMove}
        onZoom={onZoom}
        enableScroll={false}
        enableZoom={false}
      />,
    );
    const area = container.firstElementChild as HTMLElement;
    mockPointerCapture(area);

    expect(area.style.cursor).toBe('');
    dispatchPointerEvent(area, 'pointerdown', { pointerId: 1, clientX: 10, clientY: 10, pointerType: 'mouse', button: 0 });
    expect(area.style.cursor).not.toBe('grabbing');
  });
});
