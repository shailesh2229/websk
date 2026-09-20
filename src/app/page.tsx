"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { SpaceBackground } from "@/components/ui/space-background";

const ZOOM_MIN = 0.85;
const ZOOM_MAX = 1.5;
const ZOOM_SENSITIVITY = 0.003; // per pixel of deltaY — tuned for normal trackpad

export default function Home() {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const zoomRef = useRef(1.0);
  const displayZoom = useRef(1.0);
  const rafRef = useRef<number>(0);

  // Smooth display zoom with lerp
  useEffect(() => {
    const loop = () => {
      const prev = displayZoom.current;
      const target = zoomRef.current;
      displayZoom.current = prev + (target - prev) * 0.15;
      if (Math.abs(displayZoom.current - target) > 0.0001) {
        setZoomLevel(displayZoom.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only act when page is at the very top (globe section visible)
      if (window.scrollY > 0) return;

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;

      // Skip horizontal scrolls
      if (Math.abs(dy) < Math.abs(e.deltaX)) return;

      const goingDown = dy > 0; // zoom in
      const goingUp = dy < 0;   // zoom out

      const atMax = zoomRef.current >= ZOOM_MAX;
      const atMin = zoomRef.current <= ZOOM_MIN;

      if (goingUp && !atMin) {
        // Zoom out — consume this event so PageNavigator doesn't also see it
        e.preventDefault();
        const newZoom = Math.max(ZOOM_MIN, zoomRef.current + dy * ZOOM_SENSITIVITY);
        zoomRef.current = newZoom;
        return;
      }

      if (goingDown && !atMax) {
        // Zoom in — consume
        e.preventDefault();
        const newZoom = Math.min(ZOOM_MAX, zoomRef.current + dy * ZOOM_SENSITIVITY);
        zoomRef.current = newZoom;
        return;
      }

      // atMax + goingDown, or atMin + goingUp: fall through to PageNavigator (don't preventDefault)
    };

    // capture:true — fires before PageNavigator (also capture) so globe zoom takes priority
    // when scrollY === 0 and zoom is not at limit.
    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", handleWheel, { capture: true });
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

      {/* Hero text — pointer-events-none so wheel passes through */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-[84px] pb-24 pointer-events-none">
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
