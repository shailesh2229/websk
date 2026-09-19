"use client";

import { useEffect, useRef } from "react";
import { motion, useTransform, useMotionValueEvent } from "framer-motion";
import { useZoom } from "./ZoomContext";
import { HomeSection } from "@/components/sections/HomeSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";

const pages = [
  { id: 0, component: HomeSection },
  { id: 1, component: AboutSection },
  { id: 2, component: ServicesSection },
  { id: 3, component: WorkSection },
];

function ZoomLayer({ index, Component }: { index: number; Component: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { progress, targetPage } = useZoom();
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollRef = useRef<HTMLDivElement>(null);

  const clamp = (v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));
  const smooth = (a:number,b:number,x:number)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
  const layerOpacity = (k:number, p:number) => 1 - smooth(0.12, 0.38, Math.abs(p - k));

  const opacity = useTransform(progress, (p) => layerOpacity(index, p));
  const scale = useTransform(opacity, (o) => reduce ? 1 : 0.94 + 0.06 * o);
  
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
      ref={scrollRef}
      style={{
        opacity,
        scale,
        visibility,
        pointerEvents,
        position: "fixed",
        inset: 0,
        zIndex: index + 10,
      }}
      className="scrollable-layer overflow-y-auto overflow-x-hidden no-scrollbar"
    >
      <div className="w-full min-h-full block" style={{ paddingTop: 'calc(84px + 24px)', paddingBottom: '96px' }}>
        <Component />
      </div>
    </motion.div>
  );
}

export function ZoomLayers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pages.map((page) => (
        <ZoomLayer key={page.id} index={page.id} Component={page.component} />
      ))}
    </div>
  );
}
