"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { useMotionValue, useAnimationFrame, MotionValue } from "framer-motion";

export const PAGES = ["/", "/about", "/services", "/work"];

interface ZoomContextType {
  targetPage: number;
  setTargetPage: (page: number) => void;
  progress: MotionValue<number>;
  rawTarget: React.MutableRefObject<number>;
}

const ZoomContext = createContext<ZoomContextType | null>(null);

export function ZoomProvider({ children, initialPage = 0 }: { children: ReactNode; initialPage?: number }) {
  const [targetPage, setTargetState] = useState(initialPage);
  const rawTarget = useRef(initialPage);
  const progress = useMotionValue(initialPage);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Expose for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__setProgress = (p: number) => {
      rawTarget.current = p;
      progress.set(p);
    };
  }, [progress]);

  useAnimationFrame((t, delta) => {
    if (isReducedMotion.current) {
      // Instant snap if reduced motion
      progress.set(rawTarget.current);
      return;
    }
    const current = progress.get();
    const target = rawTarget.current;
    
    // Smooth every frame
    if (Math.abs(target - current) > 0.001) {
      const dtSec = delta / 1000;
      const next = current + (target - current) * (1 - Math.exp(-dtSec * 6));
      progress.set(next);
    } else if (current !== target) {
      progress.set(target);
    }
  });

  const setTargetPage = (page: number) => {
    const clamped = Math.min(3, Math.max(0, page));
    setTargetState(clamped);
    rawTarget.current = clamped;
    
    if (typeof window !== "undefined") {
      const path = PAGES[clamped];
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const idx = PAGES.indexOf(window.location.pathname);
      if (idx !== -1) {
        setTargetState(idx);
        rawTarget.current = idx;
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const idx = PAGES.indexOf(customEvent.detail.url);
      if (idx !== -1) setTargetPage(idx);
    };
    window.addEventListener("zoomNavigate", handleNavigate);
    return () => window.removeEventListener("zoomNavigate", handleNavigate);
  }, []);

  return (
    <ZoomContext.Provider value={{ targetPage, setTargetPage, progress, rawTarget }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom() {
  const ctx = useContext(ZoomContext);
  if (!ctx) throw new Error("useZoom must be used within a ZoomProvider");
  return ctx;
}
