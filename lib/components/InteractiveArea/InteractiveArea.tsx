/**
 * react-candlesticks, trendingcandles.com
 *
 * Copyright (c) 2026 Jason Wilson
 * Licensed under the MIT License (see LICENSE file in the project root).
 */

import { memo, useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.scss';

export interface InteractiveAreaProps {
  onScroll: (deltaX: number, deltaY: number, wheel?: boolean, clientX?: number, clientY?: number) => void;
  onMouseMove: (clientX: number, clientY: number, isOverButton?: boolean) => void;
  onClick?: (clientX: number, clientY: number) => void;
  onPointerDragStart?: (clientX: number, clientY: number) => boolean;
  onPointerDragMove?: (clientX: number, clientY: number) => void;
  onPointerDragEnd?: (clientX: number, clientY: number) => void;
  cursor?: string;
  onZoom: (delta: number) => void;
  enableScroll: boolean;
  enableZoom: boolean;
}

const InteractiveArea = ({
  onScroll,
  onMouseMove,
  onClick,
  onPointerDragStart,
  onPointerDragMove,
  onPointerDragEnd,
  cursor,
  onZoom,
  enableScroll,
  enableZoom,
}: InteractiveAreaProps) => {

  const dragRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const scrollAnimationFrame = useRef<number | null>(null);
  const zoomAnimationFrame = useRef<number | null>(null);
  const pendingDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pendingScrollClientPosition = useRef<{ x: number; y: number } | null>(null);
  const pendingZoom = useRef<number>(1);
  const activePointers = useRef(new Map<number, { x: number; y: number }>());
  const claimedPointerRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressNextClickRef = useRef(false);
  const pinchDistance = useRef<number | null>(null);
  const onScrollRef = useRef(onScroll);
  const onZoomRef = useRef(onZoom);
  const enableScrollRef = useRef(enableScroll);
  const enableZoomRef = useRef(enableZoom);
  const resetCursor = cursor ?? 'crosshair';
  const resetCursorRef = useRef(resetCursor);

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  useEffect(() => {
    onZoomRef.current = onZoom;
  }, [onZoom]);

  useEffect(() => {
    enableScrollRef.current = enableScroll;
  }, [enableScroll]);

  useEffect(() => {
    enableZoomRef.current = enableZoom;
  }, [enableZoom]);

  useEffect(() => {
    resetCursorRef.current = resetCursor;
  }, [resetCursor]);

  const getPointerDistance = () => {
    const pointers = Array.from(activePointers.current.values());
    if (pointers.length < 2) return null;

    const [first, second] = pointers;
    return Math.hypot(second.x - first.x, second.y - first.y);
  };

  const scheduleScroll = useCallback(() => {
    if (scrollAnimationFrame.current === null) {
      scrollAnimationFrame.current = requestAnimationFrame(() => {
        onScrollRef.current(
          pendingDelta.current.x,
          pendingDelta.current.y,
          false,
          pendingScrollClientPosition.current?.x,
          pendingScrollClientPosition.current?.y,
        );
        pendingDelta.current = { x: 0, y: 0 };
        pendingScrollClientPosition.current = null;
        scrollAnimationFrame.current = null;
      });
    }
  }, []);

  const scheduleZoom = useCallback(() => {
    if (zoomAnimationFrame.current === null) {
      zoomAnimationFrame.current = requestAnimationFrame(() => {
        onZoomRef.current(pendingZoom.current);
        pendingZoom.current = 1;
        zoomAnimationFrame.current = null;
      });
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    if (onPointerDragStart?.(e.clientX, e.clientY)) {
      claimedPointerRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        moved: false,
      };

      if (dragRef.current?.setPointerCapture) {
        dragRef.current.setPointerCapture(e.pointerId);
      }
      if (dragRef.current) {
        dragRef.current.style.cursor = 'grabbing';
      }
      return;
    }

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Capture active drag pointers so gestures remain stable if the pointer
    // leaves the element bounds or React re-renders surrounding UI.
    if (dragRef.current?.setPointerCapture) {
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
    if (claimedPointerRef.current?.pointerId === e.pointerId) {
      if (
        claimedPointerRef.current.moved === false &&
        Math.hypot(e.clientX - claimedPointerRef.current.startX, e.clientY - claimedPointerRef.current.startY) > 3
      ) {
        claimedPointerRef.current.moved = true;
      }
      onPointerDragMove?.(e.clientX, e.clientY);
      return;
    }

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
      pendingScrollClientPosition.current = { x: e.clientX, y: e.clientY };
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
    if (claimedPointerRef.current?.pointerId === e.pointerId) {
      onPointerDragEnd?.(e.clientX, e.clientY);
      suppressNextClickRef.current = claimedPointerRef.current.moved;
      claimedPointerRef.current = null;

      if (dragRef.current?.hasPointerCapture?.(e.pointerId)) {
        dragRef.current.releasePointerCapture(e.pointerId);
      }
      if (dragRef.current) {
        dragRef.current.style.cursor = resetCursor;
      }
      return;
    }

    activePointers.current.delete(e.pointerId);

    if (dragRef.current?.hasPointerCapture?.(e.pointerId)) {
      dragRef.current.releasePointerCapture(e.pointerId);
    }

    if (activePointers.current.size === 0) {
      if (dragRef.current) {
        dragRef.current.style.cursor = resetCursor;
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
      if (!enableScrollRef.current) return;
      pendingDelta.current.x -= e.deltaX;
      pendingScrollClientPosition.current = { x: e.clientX, y: e.clientY };
      if (scrollAnimationFrame.current === null) {
        scrollAnimationFrame.current = requestAnimationFrame(() => {
          onScrollRef.current(
            pendingDelta.current.x,
            pendingDelta.current.y,
            true,
            pendingScrollClientPosition.current?.x,
            pendingScrollClientPosition.current?.y,
          );
          pendingDelta.current = { x: 0, y: 0 };
          pendingScrollClientPosition.current = null;
          scrollAnimationFrame.current = null;
        });
      }
    } else {
      if (!enableZoomRef.current) return;
      const zoomFactor = e.deltaY > 0 ? 0.975 : 1.025;
      pendingZoom.current *= zoomFactor;
      scheduleZoom();
    }
  }, [scheduleZoom]);

  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;
    const pointers = activePointers.current;

    const handleWindowPointerUp = (event: PointerEvent) => {
      if (claimedPointerRef.current?.pointerId === event.pointerId) {
        onPointerDragEnd?.(event.clientX, event.clientY);
        suppressNextClickRef.current = claimedPointerRef.current.moved;
        claimedPointerRef.current = null;

        if (dragRef.current) {
          dragRef.current.style.cursor = resetCursor;
        }
        return;
      }

      if (!activePointers.current.has(event.pointerId)) return;

      activePointers.current.delete(event.pointerId);

      if (activePointers.current.size === 0) {
        if (dragRef.current) {
          dragRef.current.style.cursor = resetCursor;
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
      pointers.clear();
      lastPosition.current = null;
      pinchDistance.current = null;
      pendingDelta.current = { x: 0, y: 0 };
      pendingZoom.current = 1;
      element.style.cursor = resetCursorRef.current;
      if (scrollAnimationFrame.current !== null) {
        cancelAnimationFrame(scrollAnimationFrame.current);
        scrollAnimationFrame.current = null;
      }
      if (zoomAnimationFrame.current !== null) {
        cancelAnimationFrame(zoomAnimationFrame.current);
        zoomAnimationFrame.current = null;
      }
    };
  }, [onPointerDragEnd, resetCursor]);

  const handleLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (claimedPointerRef.current?.pointerId === e.pointerId) {
      onPointerDragEnd?.(e.clientX, e.clientY);
      suppressNextClickRef.current = claimedPointerRef.current.moved;
      claimedPointerRef.current = null;

      if (dragRef.current) {
        dragRef.current.style.cursor = resetCursor;
      }
      return;
    }

    if (!activePointers.current.has(e.pointerId)) return;

    activePointers.current.delete(e.pointerId);

    if (activePointers.current.size === 0) {
      if (dragRef.current) {
        dragRef.current.style.cursor = resetCursor;
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
      style={cursor ? { cursor } : undefined}
      onMouseMove={handleMouseMove}
      onClick={(event) => {
        if (suppressNextClickRef.current) {
          suppressNextClickRef.current = false;
          return;
        }

        onClick?.(event.clientX, event.clientY);
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handleLostPointerCapture}
    />
  );

};

export default memo(InteractiveArea);
