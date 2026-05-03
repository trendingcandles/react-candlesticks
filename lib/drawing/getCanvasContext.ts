/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

const getCanvasContext = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number,
  height: number,
  dpr: number,
  prevSize: { width: number; height: number; dpr: number } | null,
  clear: boolean = true,
) => {
  const canvas = canvasRef.current;

  if (!canvas) return false;

  if (width === 0 || height === 0) return false;

  const ctx = canvas.getContext('2d');

  if (!ctx) return false;

  // retina set-up
  if (typeof window !== 'undefined') {
    if (!prevSize || (width !== prevSize.width || height !== prevSize.height || dpr !== prevSize.dpr)) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  if (clear) {
    // // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  return ctx;
};

export default getCanvasContext;
