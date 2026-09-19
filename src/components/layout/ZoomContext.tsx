"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSpring, MotionValue } from "framer-motion";

export const PAGES = ["/", "/about", "/services", "/work", "/contact"];

interface ZoomContextType {
  targetPage: number;
  setTargetPage: (page: number) => void;
  progress: MotionValue<number>;
}

const ZoomContext = createContext<ZoomContextType | null>(null);

export function useZoom() {
  const ctx = useContext(ZoomContext);
  if (!ctx) throw new Error("useZoom must be used within a ZoomProvider");
  return ctx;
}

export function ZoomProvider({ children, initialPage = 0 }: { children: ReactNode, initialPage?: number }) {
  const [targetPage, setTargetPage] = useState(initialPage);
  
  // Spring configuration for ~900ms ease
  const progress = useSpring(initialPage, {
    stiffness: 40,
    damping: 14,
    mass: 1,
    restDelta: 0.001
  });

  useEffect(() => {
    progress.set(targetPage);
  }, [targetPage, progress]);

  // Sync URL and Handle Popstate
  useEffect(() => {
    const handlePopState = () => {
      const idx = PAGES.indexOf(window.location.pathname);
      if (idx !== -1) {
        setTargetPage(idx);
      } else {
        setTargetPage(0);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (PAGES[targetPage] && window.location.pathname !== PAGES[targetPage]) {
      window.history.pushState(null, "", PAGES[targetPage]);
    }
  }, [targetPage]);

  // Handle global custom events for navigation (from Navbar)
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
    <ZoomContext.Provider value={{ targetPage, setTargetPage, progress }}>
      {children}
    </ZoomContext.Provider>
  );
}
