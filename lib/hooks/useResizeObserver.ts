/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { type MutableRefObject, useEffect, useState, useRef, useLayoutEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

function useResizeObserver<T extends HTMLElement>(observe: boolean): [Size, MutableRefObject<T | null>] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (observe) {
      const element = ref.current;
      if (element) {
        setSize(prev => {
          if (element.offsetWidth !== prev.width || element.offsetHeight !== prev.height) {
            return {
              width: element.offsetWidth,
              height: element.offsetHeight,
            };
          }
          return prev;
        });
      }
    }
  }, [observe]);

  useEffect(() => {
    if (observe) {
      const element = ref.current;
      if (!element) return;

      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setSize(prev => {
          if (element.offsetWidth !== prev.width || element.offsetHeight !== prev.height) {
            return {
              width: element.offsetWidth,
              height: element.offsetHeight,
            };
          }
          return prev;
        });
        }
      });

      resizeObserver.observe(element);

      return () => resizeObserver.disconnect();
    }
  }, [observe]);

  return [size, ref];
}

export default useResizeObserver;
