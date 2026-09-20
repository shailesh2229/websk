"use client";

import { useEffect, useRef } from "react";
import { useZoom } from "./ZoomContext";

export function ZoomController({ children }: { children: React.ReactNode }) {
  const { targetPage, setTargetPage } = useZoom();
  
  const isCooldown = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  
  // State for strict page gating
  const boundaryTimer = useRef<NodeJS.Timeout | null>(null);
  const isArmed = useRef<"top" | "bottom" | null>(null);
  const accumulatedOverscroll = useRef(0);

  useEffect(() => {
    const handleNavigationEvent = (direction: "next" | "prev") => {
      if (document.documentElement.dataset.loader === "playing") return;
      if (isCooldown.current) return;
      
      const nextTarget = direction === "next" 
        ? Math.min(3, targetPage + 1)
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

      let scrollable: Element | null = e.target as Element;
      while (scrollable && scrollable !== document.body && !scrollable.classList.contains("scrollable-layer")) {
        scrollable = scrollable.parentElement;
      }

      if (scrollable && scrollable.classList.contains("scrollable-layer")) {
        const atTop = scrollable.scrollTop <= 2;
        const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2;

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
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        processDelta(e.deltaY, e, false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      // We don't reset arming on touchStart, the timer might be active
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      
      const cy = e.touches[0].clientY;
      const dy = cy - touchStartY.current;
      
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

      const activeLayer = document.querySelector(".scrollable-layer");
      if (activeLayer) {
        const atTop = activeLayer.scrollTop <= 2;
        const atBottom = activeLayer.scrollTop + activeLayer.clientHeight >= activeLayer.scrollHeight - 2;

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
