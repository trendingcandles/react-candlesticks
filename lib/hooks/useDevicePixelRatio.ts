/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { useEffect, useState } from 'react';

function useDevicePixelRatio() {
  const [dpr, setDpr] = useState(
    typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateDpr = () => {
      setDpr(prevDpr => {
        if (prevDpr !== window.devicePixelRatio) {
          return window.devicePixelRatio;  // update state, triggers render
        }
        return prevDpr;  // no change, no rerender
      });
    };

    // Set up media query to monitor DPR
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateDpr);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(updateDpr);
    }

    // Also update on resize (zoom or screen changes)
    window.addEventListener('resize', updateDpr);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateDpr);
      } else {
        mediaQuery.removeListener(updateDpr);
      }
      window.removeEventListener('resize', updateDpr);
    };
  }, []);

  return dpr;
}

export default useDevicePixelRatio;
