"use client";

import { useEffect, useRef } from "react";
import { useZoom } from "./ZoomContext";

export function ZoomController({ children }: { children: React.ReactNode }) {
  const { targetPage, setTargetPage } = useZoom();
  
  const isCooldown = useRef(false);
  const touchStartY = useRef(0);
  
  // State for strict page gating
  const boundaryTimer = useRef<NodeJS.Timeout | null>(null);
  const isArmed = useRef<"top" | "bottom" | null>(null);
  const accumulatedOverscroll = useRef(0);

  // ResizeObserver state
  const scrollHeightCache = useRef<number>(0);

  useEffect(() => {
    // 1. Maintain a ResizeObserver on the active layer to ensure scrollHeight is perfectly accurate
    const activeLayer = document.querySelector(`.scrollable-layer[data-page="${targetPage}"]`) as HTMLElement;
    let ro: ResizeObserver | null = null;
    
    if (activeLayer && activeLayer.firstElementChild) {
      scrollHeightCache.current = activeLayer.scrollHeight;
      ro = new ResizeObserver(() => {
        scrollHeightCache.current = activeLayer.scrollHeight;
      });
      ro.observe(activeLayer.firstElementChild);
    }
    
    return () => {
      if (ro) ro.disconnect();
    };
  }, [targetPage]);

  useEffect(() => {
    const handleNavigationEvent = (direction: "next" | "prev") => {
      if (document.documentElement.dataset.loader === "playing") return;
      if (isCooldown.current) return;
      
      const nextTarget = direction === "next" 
        ? Math.min(4, targetPage + 1)
        : Math.max(0, targetPage - 1);
        
      if (nextTarget !== targetPage) {
        setTargetPage(nextTarget);
        isCooldown.current = true;
        setTimeout(() => {
          isCooldown.current = false;
        }, 450); // Cooldown to swallow inertia after transition
      }
      
      // Reset state
      isArmed.current = null;
      accumulatedOverscroll.current = 0;
      if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
    };

    const processDelta = (deltaY: number, e: Event, isTouch: boolean) => {
      if (document.documentElement.dataset.loader === "playing") return;
      if (isCooldown.current) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      // Query the active layer directly, regardless of where the cursor is
      const activeLayer = document.querySelector(`.scrollable-layer[data-page="${targetPage}"]`) as HTMLElement;
      if (!activeLayer) return;

      // Proxy manual scrolling if the event didn't happen inside the active layer
      const target = e.target as HTMLElement;
      const isInsideActiveLayer = activeLayer.contains(target);
      
      if (!isInsideActiveLayer) {
        if (e.cancelable) e.preventDefault();
        // Only proxy if it's not a touch event (touch relies on touchmove mapping)
        if (!isTouch) {
          activeLayer.scrollTop += deltaY;
        }
      }

      const clientHeight = activeLayer.clientHeight;
      const scrollTop = activeLayer.scrollTop;
      const scrollHeight = scrollHeightCache.current || activeLayer.scrollHeight;

      const atTop = scrollTop <= 2;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

      const isPushingUp = deltaY < 0; // Scrolling up (to see previous page)
      const isPushingDown = deltaY > 0; // Scrolling down (to see next page)

      // Reset completely if moving away from boundaries
      if ((!atTop && !atBottom) || (atTop && isPushingDown) || (atBottom && isPushingUp)) {
        isArmed.current = null;
        accumulatedOverscroll.current = 0;
        if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
        return;
      }

      const boundaryHit = (atTop && isPushingUp) ? "top" : (atBottom && isPushingDown) ? "bottom" : null;

      if (boundaryHit) {
        // If we hit a boundary but aren't armed yet, prevent default to avoid rubber-banding and restart arming timer
        if (isArmed.current !== boundaryHit) {
          if (e.cancelable) e.preventDefault();
          
          if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
          boundaryTimer.current = setTimeout(() => {
            isArmed.current = boundaryHit;
            accumulatedOverscroll.current = 0;
          }, 350);
          return;
        }

        // We are armed, start accumulating deliberate force
        if (isArmed.current === boundaryHit) {
          if (e.cancelable) e.preventDefault();
          accumulatedOverscroll.current += deltaY;
          
          const threshold = isTouch ? 80 : 120;
          
          if (boundaryHit === "top" && accumulatedOverscroll.current <= -threshold) {
            handleNavigationEvent("prev");
          } else if (boundaryHit === "bottom" && accumulatedOverscroll.current >= threshold) {
            handleNavigationEvent("next");
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Use deltaMode to normalize deltaY (pixels vs lines vs pages)
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16; // lines
      else if (e.deltaMode === 2) dy *= window.innerHeight; // pages
      
      if (Math.abs(dy) > Math.abs(e.deltaX)) {
        processDelta(dy, e, false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      const cy = e.touches[0].clientY;
      const dy = cy - touchStartY.current;
      
      const activeLayer = document.querySelector(`.scrollable-layer[data-page="${targetPage}"]`) as HTMLElement;
      if (activeLayer) {
        const isInsideActiveLayer = activeLayer.contains(e.target as HTMLElement);
        if (!isInsideActiveLayer) {
          if (e.cancelable) e.preventDefault();
          activeLayer.scrollTop -= dy;
        }
      }

      // Pulling down (dy > 0) means scrolling up (deltaY < 0)
      processDelta(-dy, e, true);
      touchStartY.current = cy;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.documentElement.dataset.loader === "playing") return;
      if (isCooldown.current) return;
      
      const isDownKey = ["ArrowDown", "PageDown", " ", "End"].includes(e.key);
      const isUpKey = ["ArrowUp", "PageUp", "Home"].includes(e.key);

      if (!isDownKey && !isUpKey) return;

      const activeLayer = document.querySelector(`.scrollable-layer[data-page="${targetPage}"]`) as HTMLElement;
      if (activeLayer) {
        const clientHeight = activeLayer.clientHeight;
        const scrollTop = activeLayer.scrollTop;
        const scrollHeight = scrollHeightCache.current || activeLayer.scrollHeight;

        const atTop = scrollTop <= 2;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

        if (isDownKey && atBottom) {
          if (isArmed.current === "bottom") {
            e.preventDefault();
            handleNavigationEvent("next");
          } else {
            if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
            boundaryTimer.current = setTimeout(() => {
              isArmed.current = "bottom";
            }, 350);
          }
        } else if (isUpKey && atTop) {
          if (isArmed.current === "top") {
            e.preventDefault();
            handleNavigationEvent("prev");
          } else {
            if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
            boundaryTimer.current = setTimeout(() => {
              isArmed.current = "top";
            }, 350);
          }
        } else {
          // Normal native keyboard scroll will happen
          isArmed.current = null;
          if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
          
          // If we are focused outside the layer (e.g. somehow), we should proxy the keyboard event,
          // but our useEffect in ZoomLayers ensures focus is maintained, so it's fine.
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
    };
  }, [targetPage, setTargetPage]);

  return <>{children}</>;
}
