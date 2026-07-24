import { vi } from 'vitest';

export const createMockContext = () => {
  const ctx = {
    canvas: {
      width: 300,
      height: 150,
      getBoundingClientRect: () => ({ left: 0, top: 0, right: 300, bottom: 150, width: 300, height: 150, x: 0, y: 0, toJSON: () => ({}) }),
    },
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    setLineDash: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    quadraticCurveTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    ellipse: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    measureText: vi.fn(() => ({ width: 20 })),
    strokeStyle: '',
    fillStyle: '',
    globalAlpha: 1,
    lineWidth: 1,
    font: '',
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    textAlign: 'left' as CanvasTextAlign,
    lineJoin: 'miter' as CanvasLineJoin,
    lineCap: 'butt' as CanvasLineCap,
  };

  return ctx as unknown as CanvasRenderingContext2D;
};
