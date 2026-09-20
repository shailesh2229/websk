"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { useMotionValue, animate, MotionValue } from "framer-motion";

export const PAGES = ["/", "/about", "/services", "/work", "/contact"];

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
  const activeAnimation = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    isReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Expose for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__setProgress = (p: number) => {
      if (activeAnimation.current) activeAnimation.current.stop();
      rawTarget.current = p;
      progress.set(p);
    };
  }, [progress]);

  const setTargetPage = (page: number) => {
    const clamped = Math.min(4, Math.max(0, page));
    setTargetState(clamped);
    rawTarget.current = clamped;
    
    if (typeof window !== "undefined") {
      const path = PAGES[clamped];
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }
    }

    if (activeAnimation.current) {
      activeAnimation.current.stop();
    }

    if (isReducedMotion.current) {
      progress.set(clamped);
      return;
    }

    activeAnimation.current = animate(progress, clamped, {
      type: "tween",
      duration: 1.0, // approx 900-1100ms
      ease: [0.65, 0, 0.35, 1], // power3.inOut equivalent
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      const idx = PAGES.indexOf(window.location.pathname);
      if (idx !== -1) {
        setTargetPage(idx);
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
