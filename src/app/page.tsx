"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { SpaceBackground } from "@/components/ui/space-background";

const ZOOM_MIN = 0.85;
const ZOOM_MAX = 1.5;

export default function Home() {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const zoomRef = useRef(1.0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // let PageNavigator handle pinch
      // Only intercept vertical wheel on the home page
      // If zoom is maxed, let the event pass through for PageNavigator
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;
      if (Math.abs(dy) < Math.abs(e.deltaX)) return;

      const goingDown = dy > 0;
      const goingUp = dy < 0;
      const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (goingDown && zoomRef.current >= ZOOM_MAX) {
        // Max zoomed — release to PageNavigator (don't prevent default)
        return;
      }
      if (goingUp && window.scrollY <= 0 && zoomRef.current <= ZOOM_MIN) {
        // Min zoomed at top — nothing more to do
        return;
      }
      // If the page is scrollable and not yet at top/bottom, let native scroll happen
      if (scrolledToBottom && goingDown && zoomRef.current < ZOOM_MAX) {
        // Intercept: zoom in instead of passing to PageNavigator yet
      } else if (window.scrollY > 0) {
        // Mid-page: let native scroll handle it
        return;
      } else if (window.scrollY <= 0 && goingUp && zoomRef.current > ZOOM_MIN) {
        // At top: zoom out
      } else if (!scrolledToBottom && !goingUp) {
        return;
      }

      e.preventDefault();

      const delta = dy * 0.001; // sensitivity
      const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomRef.current + delta));
      zoomRef.current = newZoom;
      setZoomLevel(newZoom);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <>
      <SpaceBackground />

      {/* Globe — full-viewport fixed background */}
      <div
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-auto"
        style={{ zIndex: 1 }}
      >
        <div
          className="rounded-full overflow-hidden"
          style={{ width: "72vmin", height: "72vmin" }}
        >
          <RotatingEarth
            interactive={true}
            zoomLevel={zoomLevel}
            className="absolute inset-0"
          />
        </div>
      </div>

      {/* Hero text — above globe, pointer-events-none so wheel reaches globe */}
      <div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-[84px] pb-24 pointer-events-none"
      >
        <div className="flex flex-col items-center justify-center w-full px-4 my-auto pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center w-full max-w-[375px] md:max-w-none"
          >
            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white font-sans">
              WEBSK
            </h1>
            <div className="mt-8">
              <h2 className="font-[family-name:var(--font-ibm-plex)] font-bold text-[#f1f1f8] tracking-[-0.02em] leading-[1.08] text-[clamp(22px,3.6vw,52px)] text-balance mx-auto">
                Your tech partner.<br />Shailesh.
              </h2>
              <p className="font-[family-name:var(--font-ibm-plex)] font-normal text-[#c9cade] text-[clamp(13px,1.05vw,16px)] leading-[1.7] max-w-[520px] mx-auto mt-[18px] text-balance">
                Custom websites, designed and coded from scratch. Fast, modern, and built for your business.
              </p>
            </div>
          </motion.div>

          {/* Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#6a6e90] font-mono tracking-[0.28em] uppercase flex items-center gap-2 w-max"
          >
            <span>[ Drag to rotate &bull; Scroll to zoom ]</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
