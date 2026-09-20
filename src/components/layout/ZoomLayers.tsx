"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionValueEvent } from "framer-motion";
import { useZoom } from "./ZoomContext";
import { HomeSection } from "@/components/sections/HomeSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

const pages = [
  { id: 1, component: AboutSection },
  { id: 2, component: ServicesSection },
  { id: 3, component: WorkSection },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ZoomLayer({ index, Component, invGlobeScale }: { index: number; Component: any; invGlobeScale: any }) { 
  const { progress, targetPage } = useZoom();
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollRef = useRef<HTMLDivElement>(null);

  const clamp = (v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));
  const smooth = (a:number,b:number,x:number)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
  
  // Opacity: visible only close to own integer
  const opacity = useTransform(progress, (p) => 1 - smooth(0.12, 0.38, Math.abs(p - index)));
  
  // Local Scale: 0.55 to 1 when entering, 1 to 1.2 when leaving
  const localScale = useTransform(progress, (p) => {
    if (reduce) return 1;
    const dist = p - index;
    if (dist < 0) {
      const t = Math.max(0, Math.min(1, (dist + 0.4) / 0.4));
      return 0.55 + 0.45 * t;
    } else {
      const t = Math.max(0, Math.min(1, dist / 0.4));
      return 1 + 0.2 * t;
    }
  });

  const visibility = useTransform(opacity, (o) => o < 0.05 ? "hidden" : "visible");
  const pointerEvents = useTransform(opacity, (o) => o < 0.05 ? "none" : "auto");

  // Reset scroll when layer becomes active target
  useEffect(() => {
    if (targetPage === index && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [targetPage, index]);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "100vw",
        height: "100dvh",
        x: "-50%",
        y: "-50%",
        scale: invGlobeScale,
        visibility,
        pointerEvents,
        zIndex: index + 10,
      }}
    >
      <motion.div
        ref={scrollRef}
        style={{ opacity, scale: localScale, width: "100%", height: "100%" }}
        className="scrollable-layer overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        <div className="w-full min-h-full block" style={{ paddingTop: 'calc(84px + 24px)', paddingBottom: index === 3 ? '0px' : '96px' }}>
          <Component />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ZoomLayers() {
  const { progress } = useZoom();
  const [vmax, setVmax] = useState(1000);
  const [vmin, setVmin] = useState(1000);
  const [isPaused, setIsPaused] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setVmax(Math.max(window.innerWidth, window.innerHeight));
      setVmin(Math.min(window.innerWidth, window.innerHeight));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useMotionValueEvent(progress, "change", (latest) => {
    setIsPaused(latest >= 1);
    setIsDimmed(latest > 0.5);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.activePage = Math.round(latest).toString();
    }
  });

  // Calculate globe scale
  const globeScale = useTransform(progress, (p) => {
    const scale1 = (1.7 * vmax) / (0.72 * vmin);
    const scale3 = (2.6 * vmax) / (0.72 * vmin);
    
    const t = Math.min(1, Math.max(0, p));
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    if (p <= 1) {
      return 1 + (scale1 - 1) * ease;
    } else {
      const progressOver1 = (p - 1) / 2;
      return scale1 + (scale3 - scale1) * progressOver1;
    }
  });

  const invGlobeScale = useTransform(globeScale, (s) => 1 / s);

  // Globe dim overlay opacity (0 at p=0, ~0.55 inside)
  const dimOpacity = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, p));
    return t * 0.55;
  });

  // Home Hero visibility (fades out by p=0.25)
  const heroOpacity = useTransform(progress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(progress, [0, 0.25], [1, 0.9]);

  return (
    <div className="fixed inset-0 overflow-hidden stage bg-[#030305]">
      {/* Globe Circle Container */}
      <motion.div 
        className="globe absolute top-1/2 left-1/2 rounded-full overflow-hidden"
        style={{ 
          width: "72vmin", 
          height: "72vmin", 
          x: "-50%", 
          y: "-50%",
          scale: globeScale 
        }}
      >
        <RotatingEarth 
          paused={isPaused} 
          dimmed={isDimmed} 
          interactive={true} 
          className="absolute inset-0" 
        />
        <motion.div 
          className="globe-dim absolute inset-0 bg-[#000]" 
          style={{ opacity: dimOpacity, pointerEvents: "none" }} 
        />
        
        {/* Page Layers INSIDE the globe */}
        {pages.map((page) => (
          <ZoomLayer 
            key={page.id} 
            index={page.id} 
            Component={page.component} 
            invGlobeScale={invGlobeScale} 
          />
        ))}
      </motion.div>

      {/* Hero Layer (Above globe, independent) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <HomeSection />
      </motion.div>
    </div>
  );
}
