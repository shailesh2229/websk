"use client";

import { useEffect, useRef } from "react";
import { useZoom } from "./ZoomContext";

export function ZoomController({ children }: { children: React.ReactNode }) {
  const { targetPage, setTargetPage, rawTarget } = useZoom();
  const isCooldown = useRef(false);
  const snapTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Touch tracking
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchAxis = useRef<"x" | "y" | null>(null);
  const overscrollAccumulator = useRef(0);

  useEffect(() => {
    // 1. Core input handler
    const applyDelta = (deltaY: number, e: Event) => {
      // Check if loader is playing
      if (document.documentElement.dataset.loader === "playing") return;
      if (isCooldown.current) return;

      // Scrollable layer check
      let scrollable: Element | null = e.target as Element;
      while (scrollable && scrollable !== document.body && !scrollable.classList.contains("scrollable-layer")) {
        scrollable = scrollable.parentElement;
      }
      
      if (scrollable && scrollable.classList.contains("scrollable-layer")) {
        const atTop = scrollable.scrollTop <= 0;
        const atBottom = scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight <= 1;

        if (deltaY < 0 && !atTop) return; // Native scrolling up
        if (deltaY > 0 && !atBottom) return; // Native scrolling down

        // If at boundaries, require accumulation before triggering zoom
        if ((deltaY < 0 && atTop) || (deltaY > 0 && atBottom)) {
          overscrollAccumulator.current += deltaY;
          if (Math.abs(overscrollAccumulator.current) < 80) {
            return;
          }
        }
      }

      // Reset accumulator if we break through
      overscrollAccumulator.current = 0;
      
      // Prevent default browser actions (like back-swipe) once we hijack for zoom
      if (e.cancelable) e.preventDefault();

      // Apply raw delta to target
      const move = deltaY * 0.0015;
      rawTarget.current = Math.min(3, Math.max(0, rawTarget.current + move));

      // Debounced Snapping (140ms)
      if (snapTimer.current) clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => {
        const delta = rawTarget.current - targetPage;
        let snapPage = targetPage;
        
        if (delta > 0.12) {
          snapPage = Math.min(3, targetPage + 1);
        } else if (delta < -0.12) {
          snapPage = Math.max(0, targetPage - 1);
        }
        
        // Cooldown to kill inertia (450ms)
        isCooldown.current = true;
        setTargetPage(snapPage);
        
        setTimeout(() => {
          isCooldown.current = false;
        }, 450);
        
      }, 140);
    };

    // 2. Wheel Event
    const handleWheel = (e: WheelEvent) => {
      // Only care about vertical wheel
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        applyDelta(e.deltaY, e);
      }
    };

    // 3. Touch Events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchAxis.current = null;
      overscrollAccumulator.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      const dx = cx - touchStartX.current;
      const dy = cy - touchStartY.current;

      // Lock axis on first 8px
      if (!touchAxis.current) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          touchAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        }
      }

      // If vertical drag, map inverted dy to deltaY (pull down = scroll up = negative deltaY)
      if (touchAxis.current === "y") {
        applyDelta(-dy, e);
        // Reset origin so it's a relative drag
        touchStartY.current = cy;
      }
    };

    // 4. Keyboard Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.documentElement.dataset.loader === "playing") return;
      if (isCooldown.current) return;
      
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        isCooldown.current = true;
        setTargetPage(Math.min(3, targetPage + 1));
        setTimeout(() => isCooldown.current = false, 450);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        isCooldown.current = true;
        setTargetPage(Math.max(0, targetPage - 1));
        setTimeout(() => isCooldown.current = false, 450);
      }
    };

    // Bind non-passive to allow e.preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, [targetPage, setTargetPage, rawTarget]);

  return <>{children}</>;
}
