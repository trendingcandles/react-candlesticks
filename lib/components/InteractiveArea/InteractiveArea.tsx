/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { memo, useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.scss';

export interface InteractiveAreaProps {
  onScroll: (deltaX: number, deltaY: number, wheel?: boolean) => void;
  onMouseMove: (clientX: number, clientY: number, isOverButton?: boolean) => void;
  onZoom: (delta: number) => void;
  enableScroll: boolean;
  enableZoom: boolean;
}

const InteractiveArea = ({
  onScroll,
  onMouseMove,
  onZoom,
  enableScroll,
  enableZoom,
}: InteractiveAreaProps) => {

  const dragRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const scrollAnimationFrame = useRef<number | null>(null);
  const zoomAnimationFrame = useRef<number | null>(null);
  const pendingDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pendingZoom = useRef<number>(1);
  const activePointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef<number | null>(null);

  const getPointerDistance = () => {
    const pointers = Array.from(activePointers.current.values());
    if (pointers.length < 2) return null;

    const [first, second] = pointers;
    return Math.hypot(second.x - first.x, second.y - first.y);
  };

  const scheduleScroll = useCallback(() => {
    if (scrollAnimationFrame.current === null) {
      scrollAnimationFrame.current = requestAnimationFrame(() => {
        onScroll(pendingDelta.current.x, pendingDelta.current.y);
        pendingDelta.current = { x: 0, y: 0 };
        scrollAnimationFrame.current = null;
      });
    }
  }, [onScroll]);

  const scheduleZoom = useCallback(() => {
    if (zoomAnimationFrame.current === null) {
      zoomAnimationFrame.current = requestAnimationFrame(() => {
        onZoom(pendingZoom.current);
        pendingZoom.current = 1;
        zoomAnimationFrame.current = null;
      });
    }
  }, [onZoom]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Capture touch/pen pointers so gestures remain stable if the finger/stylus
    // leaves the element bounds. Keep desktop mouse hover semantics unchanged.
    if (e.pointerType !== 'mouse' && dragRef.current?.setPointerCapture) {
      dragRef.current.setPointerCapture(e.pointerId);
    }

    if (dragRef.current && (enableScroll || enableZoom)) {
      dragRef.current.style.cursor = 'grabbing';
    }

    if (activePointers.current.size === 1) {
      lastPosition.current = { x: e.clientX, y: e.clientY };
      pinchDistance.current = null;
      return;
    }

    if (activePointers.current.size === 2) {
      lastPosition.current = null;
      pinchDistance.current = getPointerDistance();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activePointers.current.size === 0) {
      onMouseMove(e.clientX, e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointers.current.has(e.pointerId)) return;

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 1 && lastPosition.current) {
      if (!enableScroll) {
        lastPosition.current = { x: e.clientX, y: e.clientY };
        return;
      }
      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;

      pendingDelta.current.x += deltaX;
      pendingDelta.current.y += deltaY;
      lastPosition.current = { x: e.clientX, y: e.clientY };

      scheduleScroll();
      return;
    }

    if (activePointers.current.size >= 2) {
      if (!enableZoom) {
        pinchDistance.current = getPointerDistance();
        return;
      }
      const nextDistance = getPointerDistance();
      if (pinchDistance.current && nextDistance && pinchDistance.current > 0) {
        pendingZoom.current *= nextDistance / pinchDistance.current;
        scheduleZoom();
      }
      pinchDistance.current = nextDistance;
    }
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.delete(e.pointerId);

    if (dragRef.current?.hasPointerCapture?.(e.pointerId)) {
      dragRef.current.releasePointerCapture(e.pointerId);
    }

    if (activePointers.current.size === 0) {
      if (dragRef.current) {
        dragRef.current.style.cursor = 'crosshair';
      }
      lastPosition.current = null;
      pinchDistance.current = null;
      return;
    }

    if (activePointers.current.size === 1) {
      const [remainingPointer] = activePointers.current.values();
      lastPosition.current = remainingPointer;
      pinchDistance.current = null;
      return;
    }

    pinchDistance.current = getPointerDistance();
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault(); // Prevents browser back/forward gesture

    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);

    if (absX > absY) {
      if (!enableScroll) return;
      pendingDelta.current.x -= e.deltaX;
      if (scrollAnimationFrame.current === null) {
        scrollAnimationFrame.current = requestAnimationFrame(() => {
          onScroll(pendingDelta.current.x, pendingDelta.current.y, true);
          pendingDelta.current = { x: 0, y: 0 };
          scrollAnimationFrame.current = null;
        });
      }
    } else {
      if (!enableZoom) return;
      const zoomFactor = e.deltaY > 0 ? 0.975 : 1.025;
      pendingZoom.current *= zoomFactor;
      scheduleZoom();
    }
  }, [enableScroll, enableZoom, onScroll, scheduleZoom]);

  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;
    const pointers = activePointers.current;

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      pointers.clear();
      lastPosition.current = null;
      pinchDistance.current = null;
      pendingDelta.current = { x: 0, y: 0 };
      pendingZoom.current = 1;
      element.style.cursor = 'crosshair';
    };
  }, [handleWheel]);

  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    const handleWindowPointerUp = (event: PointerEvent) => {
      if (!activePointers.current.has(event.pointerId)) return;

      activePointers.current.delete(event.pointerId);

      if (activePointers.current.size === 0) {
        if (dragRef.current) {
          dragRef.current.style.cursor = 'crosshair';
        }
        lastPosition.current = null;
        pinchDistance.current = null;
      } else if (activePointers.current.size === 1) {
        const [remainingPointer] = activePointers.current.values();
        lastPosition.current = remainingPointer;
        pinchDistance.current = null;
      } else {
        pinchDistance.current = getPointerDistance();
      }
    };

    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
      if (scrollAnimationFrame.current !== null) {
        cancelAnimationFrame(scrollAnimationFrame.current);
        scrollAnimationFrame.current = null;
      }
      if (zoomAnimationFrame.current !== null) {
        cancelAnimationFrame(zoomAnimationFrame.current);
        zoomAnimationFrame.current = null;
      }
    };
  }, []);

  const handleLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointers.current.has(e.pointerId)) return;

    activePointers.current.delete(e.pointerId);

    if (activePointers.current.size === 0) {
      if (dragRef.current) {
        dragRef.current.style.cursor = 'crosshair';
      }
      lastPosition.current = null;
      pinchDistance.current = null;
    } else if (activePointers.current.size === 1) {
      const [remainingPointer] = activePointers.current.values();
      lastPosition.current = remainingPointer;
      pinchDistance.current = null;
    } else {
      pinchDistance.current = getPointerDistance();
    }
  };

  useEffect(() => {
    return () => {
      if (scrollAnimationFrame.current !== null) {
        cancelAnimationFrame(scrollAnimationFrame.current);
        scrollAnimationFrame.current = null;
      }
      if (zoomAnimationFrame.current !== null) {
        cancelAnimationFrame(zoomAnimationFrame.current);
        zoomAnimationFrame.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={dragRef}
      className={styles.interactiveArea}
      onMouseMove={handleMouseMove}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handleLostPointerCapture}
    />
  );

};

export default memo(InteractiveArea);
