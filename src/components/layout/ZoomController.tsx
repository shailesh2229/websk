"use client";

import { useEffect, useRef } from "react";
import { useZoom } from "./ZoomContext";

export function ZoomController({ children }: { children: React.ReactNode }) {
  const { targetPage, setTargetPage } = useZoom();
  const overscrollRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number; locked: "h" | "v" | null } | null>(null);

  useEffect(() => {
    // 1. Loader check
    const isLoaderPlaying = () => document.documentElement.dataset.loader === "playing";

    // 2. Navigation logic
    const attemptNavigate = (delta: number) => {
      if (delta > 0 && targetPage < 4) {
        setTargetPage(targetPage + 1);
        return true;
      } else if (delta < 0 && targetPage > 0) {
        setTargetPage(targetPage - 1);
        return true;
      }
      return false;
    };

    // 3. Find scrollable container
    const getScrollContainer = (target: EventTarget | null) => {
      let el = target as HTMLElement | null;
      while (el && el !== document.body) {
        if (el.classList && el.classList.contains("scrollable-layer")) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isLoaderPlaying()) return;

      const scrollContainer = getScrollContainer(e.target);
      
      // If we are over a scrollable container, check its edges
      if (scrollContainer) {
        const atTop = scrollContainer.scrollTop <= 0;
        const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1;

        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
          overscrollRef.current += e.deltaY;
          if (Math.abs(overscrollRef.current) > 80) {
            if (attemptNavigate(overscrollRef.current)) {
              overscrollRef.current = 0; // Reset after navigation
              scrollContainer.scrollTop = e.deltaY > 0 ? scrollContainer.scrollHeight : 0;
            }
          }
          // Prevent browser bounce if we are at edge
          e.preventDefault();
        } else {
          // Normal scrolling
          overscrollRef.current = 0;
        }
      } else {
        // No scroll container (e.g. Home page or empty area)
        overscrollRef.current += e.deltaY;
        if (Math.abs(overscrollRef.current) > 80) {
          if (attemptNavigate(overscrollRef.current)) {
            overscrollRef.current = 0;
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isLoaderPlaying() || e.touches.length !== 1) return;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, locked: null };
      overscrollRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isLoaderPlaying() || !touchStartRef.current || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      
      // Lock axis after 8px of movement
      if (!touchStartRef.current.locked) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          touchStartRef.current.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        } else {
          return; // Wait for 8px
        }
      }

      // If Home Page and horizontal drag, let OrbitControls handle it (do nothing here)
      if (targetPage === 0 && touchStartRef.current.locked === "h") {
        return;
      }

      // Vertical drag = Zoom Navigation or Scrolling
      if (touchStartRef.current.locked === "v") {
        const scrollContainer = getScrollContainer(e.target);
        
        // dy is negative when swiping UP (which means scroll down / next page)
        // delta in wheel is positive when scrolling down. Let's normalize dy to match deltaY
        const simulatedDeltaY = -dy; 

        if (scrollContainer) {
          const atTop = scrollContainer.scrollTop <= 0;
          const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1;

          if ((atTop && simulatedDeltaY < 0) || (atBottom && simulatedDeltaY > 0)) {
            overscrollRef.current = simulatedDeltaY;
            if (Math.abs(overscrollRef.current) > 80) {
              if (attemptNavigate(overscrollRef.current)) {
                touchStartRef.current = null; // Reset touch to prevent multiple navigations in one swipe
              }
            }
            e.preventDefault(); // Prevent pull-to-refresh
          }
        } else {
          // No scroll container (Home)
          overscrollRef.current = simulatedDeltaY;
          if (Math.abs(overscrollRef.current) > 80) {
            if (attemptNavigate(overscrollRef.current)) {
              touchStartRef.current = null;
            }
          }
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
      overscrollRef.current = 0;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoaderPlaying()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        // If focused in scrollable, check bottom
        const scrollContainer = getScrollContainer(e.target);
        if (scrollContainer && scrollContainer.scrollTop + scrollContainer.clientHeight < scrollContainer.scrollHeight - 1) return;
        attemptNavigate(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        const scrollContainer = getScrollContainer(e.target);
        if (scrollContainer && scrollContainer.scrollTop > 0) return;
        attemptNavigate(-1);
      }
    };

    // Use passive: false for wheel and touchmove to allow e.preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetPage, setTargetPage]);

  return <>{children}</>;
}
