import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useResizeObserver from '../useResizeObserver';

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe = vi.fn();
  disconnect = vi.fn();

  trigger(target: Element) {
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

function TestComp({ observe }: { observe: boolean }) {
  const [size, ref] = useResizeObserver<HTMLDivElement>(observe);
  return (
    <>
      <div data-testid="box" ref={ref} />
      <span data-testid="size">{`${size.width}x${size.height}`}</span>
    </>
  );
}

describe('useResizeObserver', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const offsetWidthDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const offsetHeightDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    MockResizeObserver.instances = [];
    if (offsetWidthDesc) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidthDesc);
    }
    if (offsetHeightDesc) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', offsetHeightDesc);
    }
  });

  it('returns initial zero size when observe is false', () => {
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    render(<TestComp observe={false} />);
    expect(screen.getByTestId('size').textContent).toBe('0x0');
    expect(MockResizeObserver.instances).toHaveLength(0);
  });

  it('reads initial size, updates on observer callback, and disconnects on unmount', () => {
    let width = 120;
    let height = 70;
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => width });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => height });

    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

    const { unmount } = render(<TestComp observe={true} />);
    expect(screen.getByTestId('size').textContent).toBe('120x70');

    const box = screen.getByTestId('box');
    const observer = MockResizeObserver.instances[0];
    expect(observer.observe).toHaveBeenCalledWith(box);

    width = 140;
    height = 80;
    act(() => {
      observer.trigger(box);
    });
    expect(screen.getByTestId('size').textContent).toBe('140x80');

    unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
